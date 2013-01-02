/**
 * Map table that holds all known tiles.
 */
model.map = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

/**
 * Returns the current active map height.
 */
model.mapHeight = -1;

/**
 * Returns the current active map width.
 */
model.mapWidth = -1;

/**
 * Returns the distance of two positions.
 *
 * @param sx
 * @param sy
 * @param tx
 * @param ty
 */
model.distance = function( sx,sy,tx,ty ){
  var dx = Math.abs(sx-tx);
  var dy = Math.abs(sy-ty);
  return dx+dy;
};

/**
 *
 * @param ax
 * @param ay
 * @param bx
 * @param by
 */
model.moveCodeFromAtoB = function( ax,ay, bx,by ){
  if( model.distance( ax,ay, bx,by ) !== 1 ){
    util.illegalArgumentError("both positions haven't a distance of 1");
  }

  // MUST FIT
  if( bx < ax ){ return model.MOVE_CODE_LEFT; }
  if( bx > ax ){ return model.MOVE_CODE_RIGHT; }
  if( by < ay ){ return model.MOVE_CODE_UP; }
  if( by > ay ){ return model.MOVE_CODE_DOWN; }

  util.unexpectedSituationError();
};

model.isValidPosition = function( x,y ){
  return ( x >= 0 && y >= 0 && x < model.mapWidth && y < model.mapHeight );
};

model.thereIsAnOwnUnitAt = function( x,y,pid ){
  if( !model.isValidPosition(x,y) ) return false;

  var unit = model.unitPosMap[x][y];
  return ( unit !== null && pid === unit.owner );
};

model.thereIsAnAlliedUnitAt = function( x,y,pid ){
  if( !model.isValidPosition(x,y) ) return false;

  var unit = model.unitPosMap[x][y];
  return ( unit !== null && pid !== unit.owner &&
            model.players[pid].team === model.players[unit.owner].team);
};

model.thereIsAnEnemyUnitAt = function( x,y,pid ){
  if( !model.isValidPosition(x,y) ) return false;

  var unit = model.unitPosMap[x][y];
  return ( unit !== null && pid !== unit.owner &&
            model.players[pid].team !== model.players[unit.owner].team );
};