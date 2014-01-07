controller.defineGameScriptable("fuelDrainRate",50,100);
controller.defineGameScriptable("fuelDrain",    1, 99);
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

// True when uid is a valid unit id else false.
//
model.unit_isValidUnitId = function( uid ){
  return uid >= 0 &&
          uid < (MAX_UNITS_PER_PLAYER*MAX_PLAYER) &&
          model.unit_data[uid].owner !== INACTIVE_ID;
};

//
//
model.unit_getFreeSlot = function( pid ){
  if( !model.unit_hasFreeSlots(pid) ) return -1;

  var i = model.unit_firstUnitId(pid);
  var e = model.unit_lastUnitId(pid);
  for( ; i<e; i++ ){
    if( model.unit_data[i].owner === INACTIVE_ID ) return i;
  }
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
  return MAX_UNITS_PER_PLAYER * pid;
};

// Returns the last unit id of a player
//
model.unit_lastUnitId = function( pid ){
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
  for( ; i<=e; i++ ){

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

  for(; i<=e; i++ ){
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
// @TODO : set hp to number only
model.unit_convertHealthToPoints = function( hp ){
  // try to extract health when hp is an object
  if( typeof hp !== "number" ) hp = hp.hp; 
  
  return parseInt( hp/10, 10 )+1;
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
