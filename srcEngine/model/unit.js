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
  if( unit === null ){
    util.raiseError("unit argument cannot be null");
  }

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
  var startIndex = pid*CWT_MAX_UNITS_PER_PLAYER;
  for( var i=0, e=startIndex+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ){ return true; }
  }

  return false;
};

/**
 * Returns true if a given position is occupied by an unit, else false.
 *
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 */
model.tileOccupiedByUnit = function( x,y ){
  var unit = model.unitPosMap[x][y];
  if( unit === null ) return false;
  else return model.extractUnitId( unit );
};

/**
 * Counts all units that are owned by the player with the given player id.
 *
 * @param {Number} pid player id
 */
model.countUnits = function( pid ){
  var startIndex = pid*CWT_MAX_UNITS_PER_PLAYER;
  var n = 0
  for( var i=startIndex, e=startIndex+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ){
      n++;
    }
  }

  return n;
};

/**
 *
 */
model.unitHpPt = function( unit ){
  return parseInt( unit.hp/10 )+1;
};

/**
 *
 */
model.unitHpPtRest = function( unit ){
  var pt = parseInt( unit.hp/10 )+1;
  return unit.hp - pt;
};

/**
 *
 */
model.ptToHp = function( pt ){
  return (pt*10);
};