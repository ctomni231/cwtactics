controller.registerInvokableCommand("damageUnit");
controller.registerInvokableCommand("healUnit");
controller.registerInvokableCommand("hideUnit");
controller.registerInvokableCommand("joinUnits");
controller.registerInvokableCommand("unhideUnit");
controller.registerInvokableCommand("drainFuel");
controller.registerInvokableCommand("createUnit");
controller.registerInvokableCommand("destroyUnit");

// Matrix with the same metrics like the map. Every unit is placed into the 
// cell that represents its position.
//
// model.unitPosMap = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

// List of all unit objects. An inactive unit is marked with 
// {@link constants.INACTIVE_ID} as owner.
model.units = util.list( constants.MAX_PLAYER * constants.MAX_UNITS_PER_PLAYER, function(){
  return {
    hp:       99,
    x:        0,
    y:        0,
    ammo:     0,
    fuel:     0,
    loadedIn: -1,
    type:     null,
    hidden:   false,
    owner:    constants.INACTIVE_ID
  };
});

// Defines a persistence handler 
controller.persistenceHandler(
  
  // load
  function(dom){
    var data;
    
    // reset model data
    for( var i=0,e=model.units.length; i<e; i++ ){
      model.units[i].owner = constants.INACTIVE_ID;
    }
    
    // place model data by dom if given
    if( dom.units ){
      for( var i=0,e=dom.units.length; i<e; i++ ){
        data = dom.units[i];
        
        // get unit object
        var id = data[0];
        var unit = model.units[id];
        
        // inject data
        unit.type     = model.unitTypes[data[1]];
        unit.x        = data[2];
        unit.y        = data[3];
        unit.hp       = data[4];
        unit.ammo     = data[5];
        unit.fuel     = data[6];
        unit.loadedIn = data[7];
        unit.owner    = data[8];
        
        // model.unitPosMap[ data[2] ][ data[3] ] = unit;
      }
    }
  },
  
  // save
  function(dom){    
    var unit;
    
    dom.units = [];    
    for( var i=0,e=model.units.length; i<e; i++ ){
      unit = model.units[i];
      
      if( unit.owner !== constants.INACTIVE_ID ){
        dom.units.push([
          model.extractUnitId(unit),
          unit.type.ID,
          unit.x,
          unit.y,
          unit.hp,
          unit.ammo,
          unit.fuel,
          unit.loadedIn,
          unit.owner
        ]);
      }
    }
  }
);

// Returns the first unit id of a player
//
model.getFirstUnitSlotId = function( pid ){
  return constants.MAX_UNITS_PER_PLAYER * pid;
};

// Returns the last unit id of a player
//
model.getLastUnitSlotId = function( pid ){
  return (constants.MAX_UNITS_PER_PLAYER * (pid+1) ) -1;
};

// Returns the unit at a given position or null 
// if the position is not occupied by a unit.
//
model.getUnitByPos = function( x,y ){
  var l = model.units;
  var i = 0;
  var e = l.length;
  
  for( ; i<e; i++ ){
    if( l[i].x === x && l[i].y === y ) return l[i];
  }
  
  return null;
};

// Extracts the identical number from an unit object.
//
// @param unit
// 
model.extractUnitId = function( unit ){
  
  // check unit object
  if( !unit ) model.criticalError(
    constants.error.ILLEGAL_PARAMETERS, 
    constants.error.PARAMETERS_MISSING
  );
  
  var index = model.units.indexOf(unit);
  
  // not found when no index is found
  if( index === -1 ) model.criticalError(
    constants.error.ILLEGAL_PARAMETERS, 
    constants.error.UNIT_NOT_FOUND
  );
  
  return index;
};

// Returns true if a player with a given player id has free slots for new units.
// 
// @param {Number} pid player id
// @returns {Boolean}
// 
model.hasFreeUnitSlots = function( pid ){
  var i = model.getFirstUnitSlotId(pid);
  var e = model.getLastUnitSlotId(pid);
  
  for( ; i<e; i++ ){
    if( model.units[i].owner !== constants.INACTIVE_ID ) return true;
  }
  
  return false;
};

// Returns true if a given position is occupied by an unit, else false.
//
// @param {Number} x x coordinate
// @param {Number} y y coordinate
// @return {Number} -1 if tile is not occupied else the id number from the unit that occupies the tile
// 
model.isTileOccupiedByUnit = function( x,y ){
  var unit = model.unitPosMap[x][y];
  if( unit === null ) return -1;
  else return model.extractUnitId( unit );
};

// Counts all units that are owned by the player with the given player id.
//
// @param {Number} pid player id
// 
model.countUnits = function( pid ){
  var n = 0;
  var i = model.getFirstUnitSlotId(pid);
  var e = model.getLastUnitSlotId(pid);
  
  for(; i<e; i++ ){
    if( model.units[i].owner !== constants.INACTIVE_ID ) n++;
  }
  
  return n;
};

// Converts and returns the HP points from the health value of an unit.
// 
// @example
//  health ->  HP
//    69   ->   7
//    05   ->   1
//    50   ->   6
//    99   ->  10
//
// @param {object} unit
// 
model.unitHpPt = function( unit ){
  return parseInt( unit.hp/10 )+1;
};

// Gets the rest of unit health 
// 
// TODO CHECK THIS!
//    
// @param {object} unit
// 
model.unitHpPtRest = function( unit ){
  var pt = parseInt( unit.hp/10 )+1;
  return unit.hp - pt;
};

// Converts HP points to a health value.
// 
// @example
//   6 HP -> 60 health
//   3 HP -> 30 health
// 
// @param {Number} pt
// 
model.ptToHp = function( pt ){
  return (pt*10);
};

// Inflicts damage to an unit.
// 
// @param {Number|x of model.units} uid
// @param {Number} damage
// 
model.damageUnit = function( uid, damage, minRest ){
  var unit = model.units[uid];
  
  // check grabbed unit
  if( !unit ) model.criticalError(
    constants.error.ILLEGAL_PARAMETERS, constants.error.UNIT_NOT_FOUND
  );
  
  unit.hp -= damage;
  
  if( minRest && unit.hp <= minRest ){ 
    unit.hp = minRest;
  }
  else{
    
    // destroy unit when health falls to zero
    if( unit.hp <= 0 ) model.destroyUnit(uid);
  }
};

// Heals an unit. If the unit health will be greater than the maximum health value then the difference will 
// be added as gold to the owners gold depot.
// 
// @param {Number} uid
// @param {Number} health
// @param {Boolean} diffAsGold if false then the difference won't be added as gold to the owners resource depot
//                  ( default = false )
// 
model.healUnit = function( uid, health, diffAsGold ){  
  var unit = model.units[uid];
  
  // check grabbed unit
  if( !unit ) model.criticalError(
    constants.error.ILLEGAL_PARAMETERS, constants.error.UNIT_NOT_FOUND
  );
  
  unit.hp += health;
  if( unit.hp > 99 ){
    
    // pay difference of the result health and 100 as
    // gold ( in realtion to the unit cost ) to the 
    // unit owners gold depot
    if( diffAsGold === true ){
      var diff = unit.hp - 99;
      model.players[ unit.owner ].gold += parseInt( (unit.type.cost*diff)/100, 10 );
    }
    
    unit.hp = 99;
  }
};

// Hides an unit.
// 
// @param {Number} uid
//
model.hideUnit = function( uid ){
  model.units[uid].hidden = true;
};

// Unhides an unit.
// 
// @param {Number} uid
//
model.unhideUnit = function( uid ){
  model.units[uid].hidden = false;
};

// Joins two units together. If the combined health is greater than the maximum health then the difference will be
// payed to the owners resource depot.
// 
// @param {Number} juid id of the joining unit
// @param {Number} jtuid id of the join target unit
// 
model.joinUnits = function( juid, jtuid ){
  var joinSource = model.units[juid];
  var joinTarget = model.units[jtuid];
  
  // check types
  if( joinTarget.type !== joinSource.type ) model.criticalError(
    constants.error.ILLEGAL_PARAMETERS, constants.error.JOIN_TYPE_MISSMATCH
  );
  
  // health
  model.healUnit(jtuid, model.ptToHp(model.unitHpPt( joinSource )),true);
  
  // ammo
  joinTarget.ammo += joinSource.ammo;
  if( joinTarget.ammo > joinTarget.type.ammo ) joinTarget.ammo = joinTarget.type.ammo;
  
  // fuel
  joinTarget.fuel += joinSource.fuel;
  if( joinTarget.fuel > joinTarget.type.fuel ) joinTarget.fuel = joinTarget.type.fuel;
  
  // TODO experience points
  
  // disband joining unit
  joinSource.owner = constants.INACTIVE_ID;
};

// The fuel of an unit will be drained if the unit is marked for using fuel to uptain. All units of a player will 
// be checked 
//  
// @param {Number} uid unit id
// 
model.drainFuel = function( uid ){
  var unit = model.units[uid];
  var v = unit.type.dailyFuelDrain;
  
  if( typeof v === "number" ){
    
    // hidden units may drain more fuel
    if( unit.hidden && unit.type.dailyFuelDrainHidden ){
      v = unit.type.dailyFuelUseHidden;
    }
    
    unit.fuel -= v;
    
    // if fuel is empty then destroy it
    if( unit.fuel <= 0 ) model.destroyUnit(i);
  }
};

// Registers a new unit object in the stock of a player. The unit 
// will be created and placed into the tile at position (x,y).
// 
// @param {Number} pid id number of the player
// @param {Number} x x coordinate of the target
// @param {Number} y y coordinate of the target
// @param {String} type type of the new unit
// 
model.createUnit = function( pid, x, y, type ){
  var i = model.getFirstUnitSlotId(pid);
  var e = model.getLastUnitSlotId(pid);
  
  for( ; i<e; i++ ){
    
    // FILL SLOT IF FREE
    if( model.units[i].owner === constants.INACTIVE_ID ){
      var typeSheet = model.unitTypes[type];
      var unit = model.units[i];
      
      unit.hp = 99;
      unit.owner = pid;
      unit.type = typeSheet;
      unit.ammo = typeSheet.ammo; 
      unit.fuel = typeSheet.fuel;
      unit.loadedIn = -1;
      model.setUnitPosition(i,x,y);
      
      return i;
    }
  }
  
  // no free slot found
  model.criticalError( constants.error.ILLEGAL_DATA, constants.error.NO_SLOT_FREE );
};

// Returns the distance between two units
//
// @param {Number} uidA id number of the unit A
// @param {Number} uidB id number of the unit B
//
model.unitDistance = function( uidA, uidB ){
  var uA,uB;
  
  uA = model.units[uidA];
  uB = model.units[uidB];
  
  // one of the units is off map
  if( uB.x === -1 || uA.x === -1 ) return -1;
  
  return ( Math.abs( uA.x - uB.x ) + Math.abs( uA.y - uB.y ) );
};

// Deregisters an unit object from the stock of a player. The tile, where the unit is placed on, will be
// freed from any position information.
// 
// @param {Number} uid id number of the unit
// 
model.destroyUnitSilent = function( uid ){
  model.clearUnitPosition(uid);
  var unit = model.units[uid];
  
  // mark slot as unused
  unit.owner = constants.INACTIVE_ID; 
  
  // end game when the player does not have any unit left
  if( controller.configValue("noUnitsLeftLoose") === 1 && model.countUnits( unit.owner ) === 0 ){
    controller.endGameRound();
  } 
};

// Deregisters an unit object from the stock of a player. The tile, where the unit is placed on, will be
// freed from any position information.
// 
// @param {Number} uid id number of the unit
// 
model.destroyUnit = function( uid ){
  model.destroyUnitSilent(uid);
};