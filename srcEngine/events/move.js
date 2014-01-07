model.event_on("move_flushMoveData",function( move, source ){
  controller.commandStack_sharedInvokement(
    "move_clearWayCache"
  );

  for (var i = 0, e = move.length; i < e; i += 6) {
    if (move[i] === INACTIVE_ID) break;
    controller.commandStack_sharedInvokement(
      "move_appendToWayCache",
      move[i],
      move[i + 1],
      move[i + 2],
      move[i + 3],
      move[i + 4],
      move[i + 5]
    );
  }

  controller.commandStack_sharedInvokement(
    "move_moveByCache",
    source.unitId,
    source.x,
    source.y,
    0
  );
});

model.event_on("move_clearWayCache",function(){
  model.move_pathCache.resetValues();
});

model.event_on("move_appendToWayCache",function(){
  var i = 0;

  // search first free slot in the cache list
  while( model.move_pathCache[i] !== INACTIVE_ID ){
    i++;
    if( i >= MAX_SELECTION_RANGE ) assert(false);
  }

  // add tiles to cache path
  var argI = 0;
  while( argI < arguments.length ){
    model.move_pathCache[i] = arguments[argI];
    argI++;
    i++;

    if( i >= MAX_SELECTION_RANGE ) assert(false);
  }
});

model.event_on("move_moveByCache",function( uid, x, y, noFuelConsumption ){
  var way          = model.move_pathCache;
  var cX           = x;
  var cY           = y;
  var unit         = model.unit_data[ uid ];
  var uType        = unit.type;
  var mType        = model.data_movetypeSheets[ uType.movetype ];
  var wayIsIllegal = false;
  var lastIndex    = way.length - 1;
  var fuelUsed     = 0;

  // check move way by iterate through all move codes and build the path
  //
  // 1. check the correctness of the given move code
  // 2. check all tiles to recognize trapped moves
  // 3. accumulate fuel consumption ( except `noFuelConsumption` is `true` )
  //
  for( var i = 0, e = way.length; i < e; i++ ) {
    if( way[i] === INACTIVE_ID ) break;

    // set current position by current move code
    switch(way[i]) {

      case model.move_MOVE_CODES.UP:
        if( cY === 0 ) wayIsIllegal = true;
        cY--;
        break;

      case model.move_MOVE_CODES.RIGHT:
        if( cX === model.map_width - 1 ) wayIsIllegal = true;
        cX++;
        break;

      case model.move_MOVE_CODES.DOWN:
        if( cY === model.map_height - 1 ) wayIsIllegal = true;
        cY++;
        break;

      case model.move_MOVE_CODES.LEFT:
        if( cX === 0 ) wayIsIllegal = true;
        cX--;
        break;
    }

    // when the way contains an illegal value that isn't part of
    // `model.move_MOVE_CODES` then break the move process.
    assert( !wayIsIllegal );

    // is way blocked ? (niy!)
    if( false /* && model.isWayBlocked( cX, cY, unit.owner, (i === e - 1) )  */ ) {
      lastIndex = i - 1;

      // go back until you find a valid tile
      switch(way[i]) {
        case model.move_MOVE_CODES.UP:    cY++; break;
        case model.move_MOVE_CODES.RIGHT: cX--; break;
        case model.move_MOVE_CODES.DOWN:  cY--; break;
        case model.move_MOVE_CODES.LEFT:  cX++; break;
      }

      // this is normally not possible, except other modules makes a fault in this case
      // the moving system could not recognize a enemy in front of the mover that causes a `trap`
      assert( lastIndex !== -1 );

      break;
    }

    // calculate the used fuel to move onto the current tile
    // if `noFuelConsumption` is not `true` some actions like unloading does not consume fuel
    if( noFuelConsumption !== true ) fuelUsed += model.move_getMoveCosts( mType, cX, cY );
  }

  // consume fuel ( if `noFuelConsumption` is `true` then the costs will be `0` )
  unit.fuel -= fuelUsed;
  assert( unit.fuel >= 0 );

  // DO NOT ERASE POSITION IF UNIT WAS LOADED OR HIDDEN (NOT INGAME HIDDEN) SOMEWHERE
  if( unit.x >= 0 && unit.y >= 0 ) {

    model.events.clearUnitPosition( uid );
  }

  // do not set the new position if the position is already occupied
  // the action logic must take care of this situation
  if( model.unit_posData[cX][cY] === null ) model.events.setUnitPosition( uid, cX, cY );
});

(function(){

  function setPos(uid,x,y){
    var unit = model.unit_data[uid];

    unit.x = x;
    unit.y = y;
    model.unit_posData[x][y] = unit;

    model.events.modifyVisionAt( x, y, unit.owner, unit.type.vision, 1 );
  }

  // Set position
  //
  model.event_on("setUnitPosition",setPos);
  model.event_on("createUnit",function( slot, pid, x,y, type ){
    setPos(slot,x,y);
  });
})();

// Clear position.
//
model.event_on("clearUnitPosition",function(uid){
  var unit = model.unit_data[uid];
  var x    = unit.x;
  var y    = unit.y;

  model.events.modifyVisionAt( x, y, unit.owner, unit.type.vision, -1 );

  model.unit_posData[x][y] = null;
  unit.x = -unit.x;
  unit.y = -unit.y;
});
