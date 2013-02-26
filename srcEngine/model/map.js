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
 * @param {Number} sx
 * @param {Number} sy
 * @param {Number} tx
 * @param {Number} ty
 */
model.distance = function( sx,sy,tx,ty ){
  var dx = Math.abs(sx-tx);
  var dy = Math.abs(sy-ty);
  return dx+dy;
};

/**
 * Returns the move code from a tile ax,ay to bx,by.
 * 
 * @param {Number} ax
 * @param {Number} ay
 * @param {Number} bx
 * @param {Number} by
 */
model.moveCodeFromAtoB = function( ax,ay, bx,by ){
  if( model.distance( ax,ay, bx,by ) !== 1 ){
    util.raiseError("both positions haven't a distance of 1");
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

/**
 * Returns true if an own unit, in relationship to a given player id, is on a
 * tile at a given position x,y.
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} pid
 * @returns {Boolean}
 */
model.thereIsAnOwnUnitAt = function( x,y,pid ){
  if( !model.isValidPosition(x,y) ) return false;

  var unit = model.unitPosMap[x][y];
  return ( unit !== null && pid === unit.owner );
};

/**
 * Returns true if an allied unit, in relationship to a given player id, is on 
 * a tile at a given position x,y.
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} pid
 * @returns {Boolean}
 */
model.thereIsAnAlliedUnitAt = function( x,y,pid ){
  if( !model.isValidPosition(x,y) ) return false;

  var unit = model.unitPosMap[x][y];
  return ( unit !== null && pid !== unit.owner &&
            model.players[pid].team === model.players[unit.owner].team);
};

/**
 * Returns true if an enemy unit, in relationship to a given player id, is on a
 * tile at a given position x,y.
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} pid
 * @returns {Boolean}
 */
model.thereIsAnEnemyUnitAt = function( x,y,pid ){
  if( !model.isValidPosition(x,y) ) return false;

  var unit = model.unitPosMap[x][y];
  return ( unit !== null && pid !== unit.owner &&
            model.players[pid].team !== model.players[unit.owner].team );
};