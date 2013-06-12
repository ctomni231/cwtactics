/**
 * List of all available properties of a game round. If a property is not 
 * used it will be marked with an owner value {@link CWT_INACTIVE_ID}.
 */
model.properties = util.list( CWT_MAX_PROPERTIES+1, function(){
  return {
    capturePoints: 20,
    owner: -1,
    x:0,
    y:0,
    type: null
  };
});

/**
 * Matrix that has the same metrics as the game map. Every property will be 
 * placed in the cell that represents its position. A property will be 
 * accessed by model.propertyPosMap[x][y].
 */
model.propertyPosMap = util.matrix(
  CWT_MAX_MAP_WIDTH,
  CWT_MAX_MAP_HEIGHT,
  null
);

/**
 * Returns true if the tile at position x,y is a property, else false.
 * 
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 */
model.tileIsProperty = function( x,y ){
  return model.propertyPosMap[x][y] !== null;
};

/**
 * Extracts the identical number from a property object.
 *
 * @param property
 */
model.extractPropertyId = function( property ){
  if( property === null ){
    util.raiseError("property argument cannot be null");
  }
  
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i] === property ) return i;
  }
  
  util.raiseError("cannot find property",property );
};

/**
 * Counts all properties owned by the player with the given player id.
 *
 * @param {Number} pid player id
 */
model.countProperties = function( pid ){
  var n = 0;
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    if( props[i].owner === pid ) n++;
  }
  
  return n;
};


/**
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {String} type
 */
model.buildUnit = function( x,y, type ){  
  model.createUnit( model.turnOwner, x,y, type );
  
  var cost = model.unitTypes[ type ].cost;
  var pl = model.players[ model.turnOwner ];
  if( pl.gold < cost ) util.raiseError("buyer hasn't enough money");
  
  pl.gold -= cost;
  
  model.markUnitNonActable( model.extractUnitId( model.unitPosMap[x][y] ) );
};

/**
 * Returns true if a unit type is buildable by a property type.
 * 
 * @param {String} propertyType
 * @param {String} unitType
 * @returns {Boolean}
 */
model.isBuildableByFactory = function( property, unitType ){
  var bList = property.type.builds;
  if( bList === undefined ) return false;
  
  // TODO FIND BETTER SOLUTION
  // if( model.rules.blockedUnits.indexOf(uType) !== -1 ) return false;
  
  if( bList.indexOf("*") !== -1 ) return true;
  if( bList.indexOf( unitType ) !== -1 ) return true;
  if( bList.indexOf( model.unitTypes[ unitType ].movetype ) !== -1 ) return true;
  
  return false;
};

/**
 * Player gets funds from all properties.
 * 
 * @param {Number} pid id of the player
 */
model.propertyFunds = function( pid ){
  var player = model.players[pid];
  var prop;
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    
    prop = props[i];
    if( prop.owner === pid ){
      
      controller.prepareTags( prop.x, prop.y );
      var funds = controller.scriptedValue( prop.owner,"funds", prop.type.funds );
      if( typeof funds === "number" ) player.gold += funds;
    }
  }
};

/**
 * Player gets resupply from all properties.
 * 
 * @param {Number} pid id of the player
 */
model.propertySupply = function( pid ){
  var prop;
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    
    prop = props[i];
    if( prop.owner === pid && prop.type.supply ){
      var x = prop.x;
      var y = prop.y;
      
      // CHECK TEAM REPAIR OR OWN SIDE REPAIR ONLY
      var check = model.thereIsUnitCheck;
      var mode = model.MODE_OWN;
      if( controller.configValue("supplyAlliedUnits") === 1 ) mode = model.MODE_TEAM;
      
      if( check(x,y,pid,mode) ){
        var unitTp = model.unitPosMap[x][y].type;
        if( controller.objectInList(prop.type.supply,unitTp.ID, unitTp.movetype ) ){
          model.refillResources( model.unitPosMap[x][y] );
        }
      }
    }
  }
};

/**
 * Player properties repairs if possible.
 * 
 * @param {Number} pid id of the player
 */
model.propertyRepairs = function( pid ){
  var prop;
  var props = model.properties;
  for( var i=0,e=props.length; i<e; i++ ){
    
    prop = props[i];
    if( prop.owner === pid && prop.type.repairs ){
      
      var x = prop.x;
      var y = prop.y;
      
      // CHECK TEAM REPAIR OR OWN SIDE REPAIR ONLY
      var check = model.thereIsUnitCheck;
      var mode = model.MODE_OWN;
      if( controller.configValue("repairAlliedUnits") === 1 ) mode = model.MODE_TEAM;
      
      if( check(x,y,pid,mode) ){
        var unitTp = model.unitPosMap[x][y].type;
        var value = controller.objectInMap(prop.type.repairs,unitTp.ID, unitTp.movetype );
        
        if( value > 0 ) model.healUnit( model.extractUnitId(model.unitPosMap[x][y]),model.ptToHp(value),true);
      }
    }
  }
};

/**
 * Lets an unit captures a property. If the capture points of the property falls to zero then the owner of the 
 * property will be changed to the owner of the capturer.
 * 
 * @param {Number} cid id of the capturer
 * @param {Number} prid id of the property
 */
model.captureProperty = function( cid, prid ){
  var selectedUnit = model.units[cid];
  var property = model.properties[prid];
  var points = parseInt( selectedUnit.hp/10, 10 ) +1;
  
  property.capturePoints -= points;
  if( property.capturePoints <= 0 ){
    var x = property.x;
    var y = property.y;
    
    if( DEBUG ) util.log( "property",prid,"captured by",cid);
    
    model.modifyVisionAt( x,y, property.type.vision, 1 );
    
    // CRITICAL PROPERTY
    if( property.type.looseAfterCaptured === true ){
      var pid = property.owner;      
      model.playerLooses(pid);
    }
    
    // TYPE CHANGE ?
    var changeType = property.type.changeAfterCaptured;
    if( typeof changeType !== "undefined" ){
      
      if( DEBUG ) util.log( "property",prid,"changes type to",changeType);
      property.type = model.tileTypes[changeType];
    }
    
    // SET NEW META DATA
    property.capturePoints = 20;
    property.owner = selectedUnit.owner;
    
    // CAPTURE LIMIT REACHED ?
    var capLimit = controller.configValue("captureLimit");
    if( capLimit !== 0 && model.countProperties() >= capLimit ){
      controller.endGameRound();
    }
  }
};

model.resetCapturePoints = function( prid ){
  model.properties[prid].capturePoints = 20;
};

model.changePropertyType = function( pid, type ){
  model.properties[pid].type = type;
};

util.scoped(function(){
  
  function doDamage( x,y, damage ){
    // var team = model.players[invokerPid].team;
    var unit = model.unitPosMap[x][y];
    
    // DO DAMAGE 
    if( unit !== null /* && model.players[ unit.owner ].team !== team */ ){
      model.damageUnit( model.extractUnitId(unit),damage,9);
    }
  }
  
  model.fireBombAt = function( tx,ty, range, damage, owner ){
    model.doInRange( tx,ty,range, doDamage, damage );
  };
  
  model.fireSilo = function( siloId, tx,ty, range, damage, owner ){                          
    // SET EMPTY TYPE
    var type = model.properties[siloId].type;
    model.changePropertyType(siloId, model.tileTypes[type.changeTo] );
    
    // TIMER
    model.pushTimedEvent( model.daysToTurns(5), model.changePropertyType.callToList( siloId, type.ID ) );
    
    model.fireBombAt( tx,ty, range, damage, owner );
  };
});