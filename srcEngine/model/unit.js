model.unitPosMap = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

model.units = util.list( CWT_MAX_PLAYER*CWT_MAX_UNITS_PER_PLAYER, function(){
  return {
    x:0,
    y:0,
    hp: 99,
    ammo: 0,
    type: null,
    loadedIn: -1,
    fuel: 0,
    owner: CWT_INACTIVE_ID,
    _clientData_: {}
  }
});

/**
 * Extracts the identical number from an unit object.
 *
 * @param unit
 */
model.extractUnitId = function( unit ){
  if( unit === null ){
    throw Error("unit argument cannot be null");
  }

  var units = model.units;
  for( var i=0,e=units.length; i<e; i++ ){
    if( units[i] === unit ) return i;
  }

  throw Error("cannot find unit", JSON.stringify(unit) );
};

model.createUnit = function( pid, type ){
  var startIndex = pid*CWT_MAX_UNITS_PER_PLAYER;
  for( var i=startIndex, e=startIndex+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    if( model.units[i].owner === CWT_INACTIVE_ID ){

      var typeSheet = model.sheets.unitSheets[ type ];
      model.units[i].owner = pid;
      model.units[i].hp = 99;
      model.units[i].type = type;
      model.units[i].ammo = typeSheet.maxAmmo;
      model.units[i].fuel = typeSheet.maxFuel;
      model.units[i].loadedIn = -1;

      if( util.DEBUG ){
        util.logInfo("builded unit for player",pid,"in slot",i);
      }

      return i;
    }
  }

  if( util.DEBUG ){
    throw Error("cannot build unit for player",pid,"no slots free");
  }
  return -1;
};

/**
 * Destroys an unit object and removes its references from the
 * game instance.
 */
model.destroyUnit = function( uid ){
  model.eraseUnitPosition( uid );
  model.units[uid].owner = CWT_INACTIVE_ID;
};

model.hasFreeUnitSlots = function( pid ){
  var startIndex = pid*CWT_MAX_UNITS_PER_PLAYER;
  for( var i=0, e=startIndex+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ){ return true; }
  }

  return false;
};

/**
 * Erases an unit position.
 *
 * @param uid
 */
model.eraseUnitPosition = function( uid ){
  var unit = model.units[uid];
  var ox = unit.x;
  var oy = unit.y;

  // clear old position
  model.unitPosMap[ox][oy] = null;
  unit.x = -1;
  unit.y = -1;

  // UPDATE FOG
  if( unit.owner === model.turnOwner ){
    var data = new controller.ActionData();
    data.setSource( ox,oy );
    data.setAction("remVisioner");
    data.setSubAction( model.sheets.unitSheets[unit.type].vision );
    controller.pushActionDataIntoBuffer(data);
  }
};

/**
 * Sets the position of an unit.
 *
 * @param uid
 * @param tx
 * @param ty
 */
model.setUnitPosition = function( uid, tx, ty ){
  var unit = model.units[uid];
  var ox = unit.x;
  var oy = unit.y;

  unit.x = tx;
  unit.y = ty;

  model.unitPosMap[tx][ty] = unit;

  if( unit.owner === model.turnOwner ){
    var data = new controller.ActionData();
    data.setSource( tx,ty );
    data.setAction("addVisioner");
    data.setSubAction( model.sheets.unitSheets[unit.type].vision );
    controller.pushActionDataIntoBuffer(data);
  }
};

/**
 * Returns true if a given position is occupied by an unit.
 *
 * @param x
 * @param y
 */
model.tileOccupiedByUnit = function( x,y ){
  var unit = model.unitPosMap[x][y];
  if( unit === null ) return false;
  else return model.extractUnitId( unit );
};

/**
 *
 * @param pid
 */
model.countUnits = function( pid ){
  var startIndex = pid*CWT_MAX_UNITS_PER_PLAYER;
  var n = 0
  for( var i=0, e=startIndex+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ){
      n++;
    }
  }

  return n;
};