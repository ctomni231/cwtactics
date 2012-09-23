/** 
 * Screen position on x axis.
 * 
 * @example read_only
 */
cwtwc.sx = 0;

/** 
 * Screen position on y axis. 
 * 
 * @example read_only
 */
cwtwc.sy = 0;

/**  
 * Screen width in tiles. 
 * 
 * @example read_only
 */
cwtwc.sw = 0;

/** 
 * Screen height in tiles. 
 * 
 * @example read_only
 */
cwtwc.sh = 0;

/** 
 * Screen movement on x axis. 
 * If this variable is lower zero, the screen will move left a bit
 * in every update step until it reaches zero. If the value is 
 * greater zero it will move right.
 */
cwtwc.msx = 0;

/** 
 * Screen movement on y axis. 
 * If this variable is lower zero, the screen will move up a bit
 * in every update step until it reaches zero. If the value is 
 * greater zero it will move down.
 */
cwtwc.msy = 0;

/** 
 * Indicates that the screen needs to be redrawn.
 * (in future the value will be true|false)
 */
cwtwc.drawChanges = 0;

/**
 * Shifts the screen in relationship to the screen movement 
 * variables.
 */
cwtwc.solveMapShift = function(){
  var dir = -1;

  if( cwtwc.msx !== 0 ){
    if( cwtwc.msx < 0 ){ dir = 3; cwtwc.msx++; }
    else               { dir = 1; cwtwc.msx--; }
  } else if( cwtwc.msy !== 0 ){
    if( cwtwc.msy < 0 ){ dir = 0; cwtwc.msy++; }
    else               { dir = 2; cwtwc.msy--; }
  }

  if( dir !== -1 ) cwtwc.mapShift( dir, 1 );
};

/**
 * New map shift method. This one uses the update step based screen
 * movement algorithm.
 */
cwtwc.betterMapShift = function( dir, len ){

       if( dir === 0 ) cwtwc.msy -= len;
  else if( dir === 1 ) cwtwc.msx += len;
  else if( dir === 2 ) cwtwc.msy += len;
  else if( dir === 3 ) cwtwc.msx -= len;
};

/**
 * Shifts the screen by a distance in a given direction. This 
 * function calculates the redraw map.
 */
cwtwc.mapShift = function( dir, dis ){
  if( dis === undefined ) dis = 1;

  var sx = cwtwc.sx;
  var sy = cwtwc.sy;

  // update screen meta data
  switch (dir) {
    case 0:
      cwtwc.sy -= dis;
      if( cwtwc.sy < 0 ){
        cwtwc.sy = 0;
      }
      break;

    case 1:
      cwtwc.sx += dis;
      if( cwtwc.sx >= cwt.mapWidth-cwtwc.sw ) cwtwc.sx = cwt.mapWidth-cwtwc.sw-1;
      if( cwtwc.sx < 0 ) cwtwc.sx = 0; // bugfix if map width is smaller than screen width
      break;

    case 2:
      cwtwc.sy += dis;
      if( cwtwc.sy >= cwt.mapHeight-cwtwc.sh ) cwtwc.sy = cwt.mapHeight-cwtwc.sh-1;
      if( cwtwc.sy < 0 ) cwtwc.sy = 0; // bugfix if map height is smaller than screen height
      break;

    case 3:
      cwtwc.sx -= dis;
      if( cwtwc.sx < 0 ) cwtwc.sx = 0;
      break;
  }

  cwtwc.drawChanges = 0;

  // rebuild redraw map
  var xe,ye;
  var map = cwt._map;
  var shiftX = cwtwc.sx - sx;
  var shiftY = cwtwc.sy - sy;

  ye = cwtwc.sy + cwtwc.sh -1;
  if( ye >= cwt.mapHeight ) ye = cwt.mapHeight-1;
  for(var y=cwtwc.sy; y<=ye; y++){

    xe = cwtwc.sx + cwtwc.sw -1;
    if( xe >= cwt.mapWidth ) xe = cwt.mapWidth-1;
    for(var x=cwtwc.sx; x<=xe; x++){
          
          // tile type is different
      if( map[x][y] !== map[x-shiftX][y-shiftY]
        ||
          (
            // unit was/is on screen tile
            cwt._unitPosMap[x][y] !== null ||
            cwt._unitPosMap[x-shiftX][y-shiftY] !== null
          )
        ||
          (
            // property was/is on screen tile
            cwt._propertyPosMap[x][y] !== null ||
            cwt._propertyPosMap[x-shiftX][y-shiftY] !== null
          )
        ||
          // new target cell overlaps
          cwtwc.imageTypeMap[ map[x][y] ] !== undefined &&
          cwtwc.imageTypeMap[ map[x][y] ][6] === 1
        ||
          // bottom cell below target overlaps
        ( y<ye && cwtwc.imageTypeMap[ map[x][y+1] ] !== undefined
               && cwtwc.imageTypeMap[ map[x][y+1] ][6] === 1 )
        ||
          // bottom cell below target overlaps
        ( y<ye && cwtwc.imageTypeMap[ map[x-shiftX][y-shiftY+1] ] !== undefined
               && cwtwc.imageTypeMap[ map[x-shiftX][y-shiftY+1] ][6] === 1 )
      ){

        cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = true;
        cwtwc.drawChanges = 1;
      }
      else cwtwc.drawnMap[x-cwtwc.sx][y-cwtwc.sy] = false;
    }
  }

};