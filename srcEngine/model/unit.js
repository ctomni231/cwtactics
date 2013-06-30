/**
 * Matrix with the same metrics like the map. Every unit is placed into the 
 * cell that represents its position.
 */
model.unitPosMap = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

/**
 * List of all unit objects. An inactive unit is marked with 
 * {@link CWT_INACTIVE_ID} as owner.
 */
model.units = util.list( CWT_MAX_PLAYER*CWT_MAX_UNITS_PER_PLAYER, function(){
  return {
    x:0,
    y:0,
    hp: 99,
    ammo: 0,
    fuel: 0,
    type: null,
    loadedIn: -1,
    hidden: false,
    owner: CWT_INACTIVE_ID
  };
});

/**
 * Extracts the identical number from an unit object.
 *
 * @param unit
 */
model.extractUnitId = function( unit ){
  if( unit === null ) util.raiseError("unit argument cannot be null");

  var units = model.units;
  for( var i=0,e=units.length; i<e; i++ ){
    if( units[i] === unit ) return i;
  }

  util.raiseError("cannot find unit", unit );
};

/**
 * Returns true if a player with a given player id has free slots for new units.
 * 
 * @param {Number} pid player id
 * @returns {Boolean}
 */
model.hasFreeUnitSlots = function( pid ){
  
  var i=pid*CWT_MAX_UNITS_PER_PLAYER;
  var e=i+CWT_MAX_UNITS_PER_PLAYER;
  for( ; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ){
      return true;
    }
  }

  return false;
};

/**
 * Returns true if a given position is occupied by an unit, else false.
 *
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 * @return {Number} -1 if tile is not occupied else the id number from the unit that occupies the tile
 */
model.isTileOccupiedByUnit = function( x,y ){
  var unit = model.unitPosMap[x][y];
  if( unit === null ) return -1;
  else return model.extractUnitId( unit );
};

/**
 * Counts all units that are owned by the player with the given player id.
 *
 * @param {Number} pid player id
 */
model.countUnits = function( pid ){
  var n = 0;
  var i=pid*CWT_MAX_UNITS_PER_PLAYER; 
  var e=i+CWT_MAX_UNITS_PER_PLAYER;
  
  for(; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ) n++;
  }

  return n;
};

/**
 * Converts and returns the HP points from the health value of an unit.
 * 
 * @example
 *  health ->  HP
 *    69   ->   7
 *    05   ->   1
 *    50   ->   6
 *    99   ->  10
 * 
 * @param {object} unit
 */
model.unitHpPt = function( unit ){
  return parseInt( unit.hp/10 )+1;
};

/**
 * Gets the rest of unit health 
 * 
 * TODO CHECK THIS!
 *    
 * @param {object} unit
 */
model.unitHpPtRest = function( unit ){
  var pt = parseInt( unit.hp/10 )+1;
  return unit.hp - pt;
};

/**
 * Converts HP points to a health value.
 * 
 * @example
 *   6 HP -> 60 health
 *   3 HP -> 30 health
 * 
 * @param {Number} pt
 */
model.ptToHp = function( pt ){
  return (pt*10);
};

/**
 * Refills the resources of an unit.
 * 
 * @param {Number|Unit} uid id of the unit or the unit object itself
 */
model.refillResources = function( uid ){
  var unit = ( typeof uid.x === "number" )? uid : model.units[uid];
  var type = unit.type;
  unit.ammo = type.ammo;
  unit.fuel = type.fuel;
};

/**
 * A supplier supplies all surrounding units that can 
 * be supplied by the supplier.
 * 
 * @param {Number} sid supplier id
 * @param {Number} x
 * @param {Number} y
 * 
 * @example
 *  cross pattern
 *      x
 *    x o x
 *      x
 */
model.unitSuppliesNeighbours = function( sid ){
  var selectedUnit = model.units[ sid ];  
  if( selectedUnit.type.supply === undefined ) util.raiseError("unit is not a supplier unit");
  
  var x = selectedUnit.x;
  var y = selectedUnit.y;
  var pid = selectedUnit.owner;
  
  // TODO check supply targets
  
  // CHECK TEAM REPAIR OR OWN SIDE REPAIR ONLY
  var mode = ( controller.configValue("supplyAlliedUnits") === 1 )? model.MODE_TEAM : model.MODE_OWN;
  var check = model.relationShipCheck;
  
  // LEFT
  if( x > 0 && model.unitPosMap[x-1][y] !== null && 
          check( pid, model.unitPosMap[x-1][y].owner, mode ) ) model.refillResources( model.unitPosMap[x-1][y] );
  
  // UP
  if( y > 0 && model.unitPosMap[x][y-1] !== null && 
          check( pid, model.unitPosMap[x][y-1].owner, mode ) ) model.refillResources( model.unitPosMap[x][y-1] );
  
  // RIGHT
  if( x < model.mapWidth-1 && model.unitPosMap[x+1][y] !== null && 
          check( pid, model.unitPosMap[x+1][y].owner, mode ) ) model.refillResources( model.unitPosMap[x+1][y] );
  
  // DOWN
  if( y < model.mapHeight-1 && model.unitPosMap[x][y+1] !== null && 
          check( pid, model.unitPosMap[x][y+1].owner, mode ) ) model.refillResources( model.unitPosMap[x][y+1] );
};

/**
 * Inflicts damage to an unit.
 * 
 * @param {Number|x of model.units} uid
 * @param {Number} damage
 */
model.damageUnit = function( uid, damage, minRest ){
  if( typeof uid !== "number" ) util.raiseError("id expected");
  
  var unit = model.units[uid];
  unit.hp -= damage;
  
  if( minRest && unit.hp <= minRest ){ 
    unit.hp = minRest;
  }
  else{
    // DESTROY UNIT IF HEALTH FALLS TO ZERO
    if( unit.hp <= 0 ){ 
      model.destroyUnit(uid);
    }
  }
};

/**
 * Heals an unit. If the unit health will be greater than the maximum health value then the difference will 
 * be added as gold to the owners gold depot.
 * 
 * @param {Number} uid
 * @param {Number} health
 * @param {Boolean} diffAsGold if false then the difference won't be added as gold to the owners resource depot
 *                  ( default = false )
 */
model.healUnit = function( uid, health, diffAsGold ){
  if( typeof uid !== "number" ) util.raiseError("id expected");
  
  var unit = model.units[uid];
    
  unit.hp += health;
  if( unit.hp > 99 ){

    // PAY DIFFERENCE TO OWNERS GOLD DEPOT
    if( diffAsGold === true ){
      var diff = unit.hp - 99;
      model.players[ unit.owner ].gold += parseInt( (unit.type.cost*diff)/100, 10 );
    }

    unit.hp = 99;
  }
};

/**
 * Hides an unit.
 * 
 * @param {Number} uid
 */
model.hideUnit = function( uid ){
  model.units[uid].hidden = true;
};

/**
 * Unhides an unit.
 * 
 * @param {Number} uid
 */
model.unhideUnit = function( uid ){
  model.units[uid].hidden = false;
};

/**
 * Joins two units together. If the combined health is greater than the maximum health then the difference will be
 * payed to the owners resource depot.
 * 
 * @param {Number} juid id of the joining unit
 * @param {Number} jtuid id of the join target unit
 */
model.joinUnits = function( juid, jtuid ){
  var joinSource = model.units[juid];
  var joinTarget = model.units[jtuid];
  if( joinTarget.type !== joinSource.type ) util.raiseError("both units has to be the same type of unit");

  // HP
  model.healUnit(jtuid, model.ptToHp(model.unitHpPt( joinSource )),true);

  // AMMO
  joinTarget.ammo += joinSource.ammo;
  if( joinTarget.ammo > joinTarget.type.ammo ) joinTarget.ammo = joinTarget.type.ammo;

  // FUEL
  joinTarget.fuel += joinSource.fuel;
  if( joinTarget.fuel > joinTarget.type.fuel ) joinTarget.fuel = joinTarget.type.fuel;

  // TODO EXP

  // DISBAND JOINER
  joinSource.owner = CWT_INACTIVE_ID;
};

/**
 * The fuel of an unit will be drained if the unit is marked for using fuel to uptain. All units of a player will 
 * be checked 
 *  
 * @param {Number} plid
 */
model.drainFuel = function( plid ){
  
  var unit;
  var i=plid*CWT_MAX_UNITS_PER_PLAYER;
  var e=i+CWT_MAX_UNITS_PER_PLAYER;
  for(; i<e; i++ ){
    unit = model.units[i];
    if( unit.owner === CWT_INACTIVE_ID ) continue;
    
    var v = unit.type.dailyFuelDrain;
    if( typeof v === "number" ){
      
      // HIDDEN UNITS MAY DRAIN MORE FUEL
      if( unit.hidden && unit.type.dailyFuelDrainHidden ){
        v = unit.type.dailyFuelUseHidden;
      }
      
      unit.fuel -= v;
      
      // IF FUEL IS EMPTRY THEN DESTROY IT
      if( unit.fuel <= 0 ) model.destroyUnit(i);
    }
  }
};

/**
 * The fuel of an unit will be drained if the unit is marked for using fuel to uptain. All units of a player will 
 * be checked 
 * 
 * @param {Number} plid
 */
model.supplyUnitsBySupplierUnits = function( plid ){
  var i=plid*CWT_MAX_UNITS_PER_PLAYER;
  var e=i+CWT_MAX_UNITS_PER_PLAYER;
  for(; i<e; i++ ){
    unit = model.units[i];
    if( unit.owner === CWT_INACTIVE_ID ) continue;
    
    if( unit.type.supply !== undefined ) model.unitSuppliesNeighbours(i);
  }
};

/**
 * Registers a new unit object in the stock of a player. The unit 
 * will be created and placed into the tile at position (x,y).
 * 
 * @param {Number} pid id number of the player
 * @param {Number} x x coordinate of the target
 * @param {Number} y y coordinate of the target
 * @param {String} type type of the new unit
 */
model.createUnit = function( pid, x, y, type ){
  
  var i = pid*CWT_MAX_UNITS_PER_PLAYER;
  var e = i+CWT_MAX_UNITS_PER_PLAYER;
  for( ; i<e; i++ ){

    // FILL SLOT IF FREE
    if( model.units[i].owner === CWT_INACTIVE_ID ){
      var typeSheet = model.unitTypes[type];
      var unit = model.units[i];
      
      unit.hp = 99;
      unit.owner = pid;
      unit.type = typeSheet;
      unit.ammo = typeSheet.ammo; 
      unit.fuel = typeSheet.fuel;
      unit.loadedIn = -1;
      model.setUnitPosition(i,x,y);

      if( DEBUG ) util.log("build unit for player",pid,"in slot",i);
      return;
    }
  }

  util.raiseError("cannot build unit for player",pid,"because no slot is free");
};

/**
 * Deregisters an unit object from the stock of a player. The tile, where the unit is placed on, will be
 * freed from any position information.
 * 
 * @param {Number} uid id number of the unit
 */
model.destroyUnit_silent = function( uid ){
  model.clearUnitPosition(uid);
  var unit = model.units[uid];
  
  // MARK UNIT AS UNUSED
  unit.owner = CWT_INACTIVE_ID; 

  // END GAME IF NO UNIT LEFT LOOSE CONDITION IS TRUE
  if( controller.configValue("noUnitsLeftLoose") === 1 && model.countUnits( unit.owner ) === 0 ){
    controller.endGameRound();
  } 
};

/**
 * Deregisters an unit object from the stock of a player. The tile, where the unit is placed on, will be
 * freed from any position information.
 * 
 * @param {Number} uid id number of the unit
 */
model.destroyUnit = function( uid ){
  model.destroyUnit_silent(uid);
};