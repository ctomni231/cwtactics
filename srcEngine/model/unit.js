// commands
controller.action_registerCommands("unit_inflictDamage");
controller.action_registerCommands("unit_heal");
controller.action_registerCommands("unit_hide");
controller.action_registerCommands("unit_join");
controller.action_registerCommands("unit_unhide");
controller.action_registerCommands("unit_drainFuel");
controller.action_registerCommands("unit_create");
controller.action_registerCommands("unit_destroy");
controller.action_registerCommands("unit_destroySilently");

// events
controller.event_define("unit_inflictDamage");
controller.event_define("unit_heal");
controller.event_define("unit_hide");
controller.event_define("unit_join");
controller.event_define("unit_unhide");
controller.event_define("unit_drainFuel");
controller.event_define("unit_create");
controller.event_define("unit_destroy");

// scriptables
controller.defineGameScriptable("fuelDrainRate",50,100);
controller.defineGameScriptable("fuelDrain",    1, 99);

// configs
controller.defineGameConfig("noUnitsLeftLoose",0,1,0);
controller.defineGameConfig("unitLimit",0,MAX_UNITS_PER_PLAYER,0);

// List of all unit objects. An inactive unit is marked with {@link INACTIVE_ID} as owner.
//
model.unit_data = util.list( MAX_PLAYER * MAX_UNITS_PER_PLAYER, function(){
  return {
    hp:       99,
    x:        0,
    y:        0,
    ammo:     0,
    fuel:     0,
    loadedIn: -1,
    type:     null,
    hidden:   false,
    owner:    INACTIVE_ID
  };
});

// Matrix with the same metrics like the map. Every unit is placed into the 
// cell that represents its position.
//
model.unit_posData = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, null );

// True when uid is a valid unit id else false.
//
model.unit_isValidUnitId = function( uid ){
  return uid >= 0 && 
          uid < (MAX_UNITS_PER_PLAYER*MAX_PLAYER) && 
          model.unit_data[uid].owner !== INACTIVE_ID;
};

// Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
// 
model.unit_thereIsAUnit = function( x,y,pid,mode ){
  if( !model.map_isValidPosition(x,y) ) return false;

  assert( model.player_isValidPid(pid) );
  
  var unit = model.unit_posData[x][y];
  return unit !== null && model.player_getRelationship(pid,unit.owner) === mode;
};

// Returns the first unit id of a player
//
model.unit_firstUnitId = function( pid ){
  assert( model.player_isValidPid(pid) );
  
  return MAX_UNITS_PER_PLAYER * pid;
};

// Returns the last unit id of a player
//
model.unit_lastUnitId = function( pid ){
  assert( model.player_isValidPid(pid) );

  return (MAX_UNITS_PER_PLAYER * (pid+1) ) -1;
};

// Returns the unit at a given position or null if the position is not occupied by a unit.
//
model.unit_getByPos = function( x,y ){
  assert( model.map_isValidPosition(x,y) );

  return model.unit_posData[x][y];
};

// Extracts the identical number from an unit object.
//
model.unit_extractId = function( unit ){
  assert( unit !== null );
  
  var index = model.unit_data.indexOf(unit);

  assert( index > -1 );
  return index;
};

// Returns true if a player with a given player id has free slots for new units.
// 
model.unit_hasFreeSlots = function( pid ){
  assert( model.player_isValidPid(pid) );

	var uLimit = controller.configValue("unitLimit");
	if( !uLimit ) uLimit = 9999999;
	
  var i     = model.unit_firstUnitId(pid);
  var e     = model.unit_lastUnitId(pid);
	var count = 0;
	var res   = false;
  for( ; i<e; i++ ){
		
		// found slot
    if( model.unit_data[i].owner === INACTIVE_ID ) res = true;
		else{
			count++;
			
			// no new units possible due unit limit
			if( count >= uLimit ) return false;
		}
  }
	
  return res;
};

// Returns true if a given position is occupied by an unit, else false.
//
model.unit_isTileOccupied = function( x,y ){
  assert( model.map_isValidPosition(x,y) );

  var unit = model.unit_posData[x][y];
  return ( unit === null )? -1 : model.unit_extractId( unit );
};

// Counts all units that are owned by the player with the given player id.
//
model.unit_countUnits = function( pid ){
  assert( model.player_isValidPid(pid) );

  var n = 0;
  var i = model.unit_firstUnitId(pid);
  var e = model.unit_lastUnitId(pid);
  
  for(; i<e; i++ ){
    if( model.unit_data[i].owner !== INACTIVE_ID ) n++;
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
model.unit_convertHealthToPoints = function( unit ){
  // TODO: change API later ( should be not using an unit )
  assert( unit.hp > 0 && unit.hp <= 99 && unit.hp%1 === 0 );

  return parseInt( unit.hp/10 )+1;
};

// Gets the rest of unit health 
// 
model.unit_convertHealthToPointsRest = function( unit ){
  // TODO: change API later ( should be not using an unit )
  assert( util.intRange(unit.hp,0,99) );

  return unit.hp - (parseInt( unit.hp/10 )+1);
};

// Converts HP points to a health value.
// 
// @example
//   6 HP -> 60 health
//   3 HP -> 30 health
// 
model.unit_convertPointsToHealth = function( pt ){
  assert( util.intRange(pt,0,10) );

  return (pt*10);
};

// Inflicts damage to an unit.
// 
model.unit_inflictDamage = function( uid, damage, minRest ){
  assert( model.unit_isValidUnitId(uid) );
  assert( util.isInt(damage) );
  assert( util.isUndefined(minRest) || util.intRange(minRest,0,10) );

  var unit = model.unit_data[uid];
  assert( unit !== null );
  
  unit.hp -= damage;
  
  if( minRest && unit.hp <= minRest ){ 
    unit.hp = minRest;
  }
  else{
    
    // destroy unit when health falls to zero
    if( unit.hp <= 0 ) model.unit_destroy(uid);
  }
  
  controller.events.unit_inflictDamage( uid, damage, minRest );
};

// Heals an unit. If the unit health will be greater than the maximum health value then 
// the difference will be added as gold to the owners gold depot.
// 
model.unit_heal = function( uid, health, diffAsGold ){  
  assert( model.unit_isValidUnitId(uid) );
  assert( health >= 0 && health%1 === 0 );
  assert( util.isBoolean(diffAsGold) || util.isUndefined(diffAsGold) );

  var unit = model.unit_data[uid];
  assert( unit !== null );
  
  unit.hp += health;
  if( unit.hp > 99 ){
    
    // pay difference of the result health and 100 as
    // gold ( in realtion to the unit cost ) to the 
    // unit owners gold depot
    if( diffAsGold === true ){
      var diff = unit.hp - 99;
      model.player_data[ unit.owner ].gold += parseInt( (unit.type.cost*diff)/100, 10 );
    }
    
    unit.hp = 99;
  }
  
  controller.events.unit_heal( uid, health );
};

// Hides an unit.
// 
model.unit_hide = function( uid ){ 
  assert( model.unit_isValidUnitId(uid) );

  model.unit_data[uid].hidden = true;
  controller.events.unit_hide( uid );
};

// Unhides an unit.
// 
model.unit_unhide = function( uid ){ 
  assert( model.unit_isValidUnitId(uid) );

  model.unit_data[uid].hidden = false;
  controller.events.unit_unhide( uid );
};

// Returns true if two units can join each other in the current situation, else false. 
// Transporters cannot join each other when they loaded units.
//
model.unit_areJoinable = function( juid, jtuid ){
  assert( model.unit_isValidUnitId(juid) );
  assert( model.unit_isValidUnitId(jtuid) );

  var joinSource = model.unit_data[juid];
  var joinTarget = model.unit_data[jtuid];

  // no merge of transporters with loads
  if( model.transport_hasLoads( juid ) || model.transport_hasLoads( jtuid ) ) return false;
    
  return ( joinSource.type === joinTarget.type && joinTarget.hp < 90 ); 
};

// Joins two units together. If the combined health is greater than the maximum health then 
// the difference will be payed to the owners resource depot.
// 
model.unit_join = function( juid, jtuid ){
  assert( model.unit_isValidUnitId(juid) );
  assert( model.unit_isValidUnitId(jtuid) );

  var joinSource = model.unit_data[juid];
  var joinTarget = model.unit_data[jtuid];
  
  assert(joinTarget.type === joinSource.type);

  // health
  model.unit_heal(jtuid, model.unit_convertPointsToHealth(
    model.unit_convertHealthToPoints( joinSource )),true);
  
  // ammo
  joinTarget.ammo += joinSource.ammo;
  if( joinTarget.ammo > joinTarget.type.ammo ) joinTarget.ammo = joinTarget.type.ammo;
  
  // fuel
  joinTarget.fuel += joinSource.fuel;
  if( joinTarget.fuel > joinTarget.type.fuel ) joinTarget.fuel = joinTarget.type.fuel;
  
  // TODO experience points
  
  // disband joining unit
  joinSource.owner = INACTIVE_ID;
  
  controller.events.unit_join( juid, jtuid );  
};

// The fuel of an unit will be drained if the unit is marked for using fuel to uptain. All units 
// of a player will be checked 
//  
model.unit_drainFuel = function( uid ){
  assert( model.unit_isValidUnitId(uid) );

  var unit = model.unit_data[uid];
  
  var v = unit.type.dailyFuelDrain;
  if( typeof v === "number" ){
    
    // hidden units may drain more fuel
    if( unit.hidden && unit.type.dailyFuelDrainHidden ){
      v = unit.type.dailyFuelDrainHidden;
    }

    v = parseInt( controller.scriptedValue( unit.owner, "fuelDrain", v )/100*
                  controller.scriptedValue( unit.owner, "fuelDrainRate", 100 ), 10);
    
    unit.fuel -= v;
    
    controller.events.unit_drainFuel( uid, v );
    
    // if fuel is empty then destroy it
    if( unit.fuel <= 0 ) model.unit_destroy( uid );
  }
};

// Registers a new unit object in the stock of a player. The unit 
// will be created and placed into the tile at position (x,y).
// 
model.unit_create = function( pid, x, y, type ){
  assert( model.map_isValidPosition(x,y) );
  assert( model.player_isValidPid(pid) );
  assert( model.data_unitSheets.hasOwnProperty(type) );

  var i = model.unit_firstUnitId(pid);
  var e = model.unit_lastUnitId(pid);
  
  // at least one slot must be free
  assert( model.unit_hasFreeSlots(pid) );

  for( ; i<e; i++ ){
    
    // if slot is freem then use it
    if( model.unit_data[i].owner === INACTIVE_ID ){
      var typeSheet    = model.data_unitSheets[type];
      var unit        = model.unit_data[i];
      
      unit.hp         = 99;
      unit.owner      = pid;
      unit.type       = typeSheet;
      unit.ammo       = typeSheet.ammo; 
      unit.fuel       = typeSheet.fuel;
      unit.loadedIn   = -1;
      model.move_setUnitPosition(i,x,y);
      
      controller.events.unit_create( pid,x,y,type,i );
      
      return i;
    }
  }
};

// Returns the distance between two units.
//
model.unit_getDistance = function( uidA, uidB ){
  assert( model.unit_isValidUnitId(uidA) );
  assert( model.unit_isValidUnitId(uidB) );

  var uA,uB;
  
  uA = model.unit_data[uidA];
  uB = model.unit_data[uidB];
  
  // one of the units is off map
  if( uB.x === -1 || uA.x === -1 ) return -1;
  
  return ( Math.abs( uA.x - uB.x ) + Math.abs( uA.y - uB.y ) );
};

// Deregisters an unit object from the stock of a player. The tile, where the unit is placed on,
// will be freed from any position information.
// 
model.unit_destroySilently = function( uid ){
  assert( model.unit_isValidUnitId(uid) );
  
  model.move_clearUnitPosition(uid);
  var unit = model.unit_data[uid];
  
  // mark slot as unused
  unit.owner = INACTIVE_ID;
  
  // end game when the player does not have any unit left
  if( controller.configValue("noUnitsLeftLoose") === 1 && 
      model.unit_countUnits( unit.owner ) === 0 ){
    controller.update_endGameRound();
  } 
  
  controller.events.unit_destroy( uid );
};

// Deregisters an unit object from the stock of a player. The tile, where the unit is placed on, 
// will be freed from any position information.
// 
model.unit_destroy = function( uid ){
  model.unit_destroySilently(uid);
};