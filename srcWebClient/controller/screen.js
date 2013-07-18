/**
 *
 */
controller.screenElement = document.getElementById("cwt_canvas");

/**
 * Screen position on x axis.
 *
 * @example read_only
 */
controller.screenX = 0;

/**
 * Screen position on y axis.
 *
 * @example read_only
 */
controller.screenY = 0;

/**
 * Screen width in tiles.
 *
 * @example read_only
 */
controller.screenWidth = -1;

/**
 * Screen height in tiles.
 *
 * @example read_only
 */
controller.screenHeight = -1;

/**
 *
 */
controller.screenScale = 1;

/**
 * Screen movement on x axis.
 * If this variable is lower zero, the screen will move left a bit
 * in every update step until it reaches zero. If the value is
 * greater zero it will move right.
 */
controller.moveScreenX = 0;

/**
 * Screen movement on y axis.
 * If this variable is lower zero, the view will move up a bit
 * in every update step until it reaches zero. If the value is
 * greater zero it will move down.
 */
controller.moveScreenY = 0;

/**
 *
 * @param scale
 * @throws Error if the screen scale is not an integer
 */
controller.setScreenScale = function( scale ){
  if( scale < -1 || scale > 3 ){
    return;
  }
  
  controller.screenScale = scale;
  
  // INVOKES SCALING TRANSITION
  controller.screenElement.className = "scale"+scale;
  
  if( scale === 0 ) scale = 0.8;
  else if( scale === -1 ) scale = 0.7;
  
  // TODO: UPDATE SCREEN PARAMETERS
  var tileLen = TILE_LENGTH*scale;
  controller.screenWidth  = parseInt( window.innerWidth/  tileLen, 10 );
  controller.screenHeight = parseInt( window.innerHeight/ tileLen, 10 );
  
  controller.setScreenPosition(
    controller.screenX,
    controller.screenY,
    false
  );
};

controller.getCanvasPosX = function( x ){
  return ( x * TILE_LENGTH * controller.screenScale );
};

controller.getCanvasPosY = function( y ){
  return ( y * TILE_LENGTH * controller.screenScale );
};

/**
 *
 * @param x x coordinate
 * @param y y coordinate
 * @param centerIt if true, the screen position will be set to a position
 *                 that makes the given position x,y the center of the screen.
 */
controller.setScreenPosition = function( x,y, centerIt ){
  
  controller.screenX = x;
  controller.screenY = y;
  
  var style = controller.screenElement.style;
  var scale = controller.screenScale;
  var left = -( controller.screenX * TILE_LENGTH * scale );
  var top = -( controller.screenY * TILE_LENGTH * scale );
  
  switch( scale ){
      
    case 2:
      left += controller.screenElement.width/2;
      top += controller.screenElement.height/2;
      break;
      
    case 3:
      left += controller.screenElement.width;
      top += controller.screenElement.height;
      break;
  }
  
  style.position = "absolute";
  style.left = left+"px";
  style.top = top+"px";
};

/**
 * Shifts the screen into a given direction.
 *
 * @param code move code that represents the wanted direction
 * @param len length of tiles that will be shifted into the direction
 *            (default=1)
 */
controller.shiftScreenPosition = function( code, len ){
  if( arguments.length === 1 ) len = 1;
  
  var x = controller.screenX;
  var y = controller.screenY;
  switch( code ){
    case model.MOVE_CODE_DOWN:  y += len; break;
    case model.MOVE_CODE_RIGHT: x += len; break;
    case model.MOVE_CODE_UP:    y -= len; break;
    case model.MOVE_CODE_LEFT:  x -= len; break;
  }
  
  // CORRECT BOUNDS
  if( x < 0 ) x = 0;
  if( y < 0 ) y = 0;
  if( x >= model.mapWidth ) x = model.mapWidth-1;
  if( y >= model.mapHeight ) y = model.mapHeight-1;
  
  controller.setScreenPosition( x,y, false );
};

/**
 * 
 */
view.resizeCanvas = function(){
  var canvEl = controller.screenElement;

  canvEl.width = TILE_LENGTH*model.mapWidth;
  canvEl.height = TILE_LENGTH*model.mapHeight;

  controller.screenWidth  = parseInt( window.innerWidth/  TILE_LENGTH, 10 );
  controller.screenHeight = parseInt( window.innerHeight/ TILE_LENGTH, 10 );
};