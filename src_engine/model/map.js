// Map table that holds all known tiles.
//
model.map_data = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, null );

// Returns the current active map height.
//
model.map_height = -1;

// Returns the current active map width.
//
model.map_width = -1;

// Returns the distance of two positions.
//
model.map_getDistance = function( sx,sy,tx,ty ){
  assert( model.map_isValidPosition(sx,sy) );
  assert( model.map_isValidPosition(tx,ty) );

  return Math.abs(sx-tx)+Math.abs(sy-ty);
};

// Returns true if the given position (x,y) is valid on the current active map, else false.
//
model.map_isValidPosition = function( x,y ){
  return (
    x >= 0 &&
    y >= 0 &&
    x < model.map_width &&
    y < model.map_height
  );
};

// Invokes a callback on all tiles in a given range at a position (x,y).
//
model.map_doInRange = function( x,y, range, cb, arg ){
  assert( model.map_isValidPosition(x,y) );
  assert( util.isInt(range) && range>=0 );
  assert( typeof cb === "function" );

  var lX;
  var hX;
  var lY = y-range;
  var hY = y+range;
  if( lY < 0 ) lY = 0;
  if( hY >= model.map_height ) hY = model.map_height-1;
  for( ; lY<=hY; lY++ ){

    var disY = Math.abs( lY-y );
    lX = x-range+disY;
    hX = x+range-disY;
    if( lX < 0 ) lX = 0;
    if( hX >= model.map_width ) hX = model.map_width-1;
    for( ; lX<=hX; lX++ ){

      // invoke the callback on all tiles in range
      // if a callback returns `false` then the process will be stopped
      if( cb( lX,lY, arg, Math.abs(lX-x)+disY ) === false ) return;

    }
  }
};
