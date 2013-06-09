/**
 * Map table that holds all known tiles.
 */
model.map = util.matrix( CWT_MAX_MAP_WIDTH, CWT_MAX_MAP_HEIGHT, null );

/**
 * Returns the current active map height.
 * 
 * @type {Number}
 */
model.mapHeight = -1;

/**
 * Returns the current active map width.
 * 
 * @type {Number}
 */
model.mapWidth = -1;

/**
 * Returns the distance of two positions.
 *
 * @param {Number} sx x coordinate of the source position
 * @param {Number} sy y coordinate of the source position
 * @param {Number} tx x coordinate of the target position
 * @param {Number} ty y coordinate of the target position
 */
model.distance = function( sx,sy,tx,ty ){
  var dx = Math.abs(sx-tx);
  var dy = Math.abs(sy-ty);
  return dx+dy;
};

/**
 * Returns the move code from a tile (ax,ay) to (bx,by).
 * 
 * @param {Number} ax x coordinate of the position A
 * @param {Number} ay y coordinate of the position A
 * @param {Number} bx x coordinate of the position B
 * @param {Number} by y coordinate of the position B
 */
model.moveCodeFromAtoB = function( ax,ay, bx,by ){
  if( model.distance( ax,ay, bx,by ) !== 1 ){
    util.raiseError("both positions haven't a distance of 1");
  }

  if( bx < ax ){ return model.MOVE_CODE_LEFT;  }
  if( bx > ax ){ return model.MOVE_CODE_RIGHT; }
  if( by < ay ){ return model.MOVE_CODE_UP;    }
  if( by > ay ){ return model.MOVE_CODE_DOWN;  }

  util.raiseError("fatal error while getting move code from (",ax,",",ay,") to (",bx,",",by,")");
};

/**
 * Returns true if the given position (x,y) is valid on the current active map, else false.
 * 
 * @param {Number} x
 * @param {Number} y
 * @returns {Boolean}
 */
model.isValidPosition = function( x,y ){
  return ( 
    x >= 0 && 
    y >= 0 && 
    x < model.mapWidth && 
    y < model.mapHeight 
  );
};

/**
 *
 */
model.doInRange = function( x,y, range, cb, arg ){
  
  var lX;
  var hX;
  var lY = y-range;
  var hY = y+range;
  if( lY < 0 ) lY = 0;
  if( hY >= model.mapHeight ) hY = model.mapHeight-1;
  for( ; lY<=hY; lY++ ){
    
    var disY = Math.abs( lY-y );
    lX = x-range+disY;
    hX = x+range-disY;
    if( lX < 0 ) lX = 0;
    if( hX >= model.mapWidth ) hX = model.mapWidth-1;
    for( ; lX<=hX; lX++ ){
      
      cb( lX,lY, arg, Math.abs(lX-x)+disY );
      
    }
  }
};