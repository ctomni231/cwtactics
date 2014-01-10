/**
 *
 */
controller.screenElement = document.getElementById("cwt_canvas");

//
//
controller.infoElement = document.getElementById( "cwt_game_infoBar" );

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
 * Screen width in pixels.
 *
 * @example read_only
 */
controller.screenWidthPx = -1;

/**
 * Screen height in pixels.
 *
 * @example read_only
 */
controller.screenHeightPx = -1;

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
  if( scale < 1 || scale > 3 ){
    return;
  }

  controller.screenScale = scale;

  // INVOKES SCALING TRANSITION
  controller.screenElement.className = "scale"+scale;

  view.updateScreenPosition();
};

controller.getMapXByScreenX = function( x ){
  return controller.screenX + parseInt(x/(TILE_LENGTH*controller.screenScale),10);
};

controller.getMapXByScreenY = function( y ){
  return controller.screenY + parseInt(y/(TILE_LENGTH*controller.screenScale),10);
};

controller.getCanvasPosX = function( x ){
  return ( x * TILE_LENGTH );
};

controller.getCanvasPosY = function( y ){
  return ( y * TILE_LENGTH );
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
    case model.move_MOVE_CODES.DOWN:  y += len; break;
    case model.move_MOVE_CODES.RIGHT: x += len; break;
    case model.move_MOVE_CODES.UP:    y -= len; break;
    case model.move_MOVE_CODES.LEFT:  x -= len; break;
  }

  // CORRECT BOUNDS
  if( x < 0 ) x = 0;
  if( y < 0 ) y = 0;
  if( x >= model.map_width ) x = model.map_width-1;
  if( y >= model.map_height ) y = model.map_height-1;

  controller.setScreenPosition( x,y, false );
};

// Resizes the canvas to fit with the actual map size.
//
view.resizeCanvas = function(){
  var canvEl = controller.screenElement;
  canvEl.width = TILE_LENGTH*model.map_width;
  canvEl.height = TILE_LENGTH*model.map_height;
  view.updateScreenPosition();
};

(function(){
  
  function checkSide( sW, cW, oP ){
    if( cW > sW ){
      // greater than screen
      return oP;
    } else {
      // smaller than screen
      cW = parseInt( cW/2, 10 );
      sW = parseInt( sW/2, 10 );
      return -sW+cW;
    }  
  }
  
  // Updates the screen position and screen meta data. 
  // When the map size is smaller than the screen, then the map
  // will be centered. When the map is greater than the screen, 
  // then map will be placed on top at the current shifted position.
  //
  view.updateScreenPosition = function(){
    var tileLen = TILE_LENGTH*controller.screenScale;
    
    // screen area bounds
    var swidth = controller.screenWidth  = parseInt( window.innerWidth/  tileLen, 10 );
    var sheight = controller.screenHeight = parseInt( window.innerHeight/ tileLen, 10 );
    controller.screenWidthPx = window.innerWidth;
    controller.screenHeightPx = window.innerHeight;

    // real size of the canvas
    var cwidth = model.map_width;
    var cheight = model.map_height;
    
    var nPosX = checkSide( swidth,cwidth,controller.screenX );
    var nPosY = checkSide( sheight,cheight,controller.screenY )
    
    // set new screen position
    controller.setScreenPosition(nPosX,nPosY,false);
    
    // set position of the info box
    if( nPosX < 0 ){
      var nPos = ((-nPosX)*tileLen)-160;
      controller.infoElement.style.right = ((nPos>0)? nPos:"4px")+"px";
      //controller.infoElement.style.right = "";
    } else {
      controller.infoElement.style.right = "4px";
      //controller.infoElement.style.right = "";
    }
    
    if( nPosY < 0 ){
      var nPos = ((-nPosY)*tileLen);
      controller.infoElement.style.bottom = ((nPos>0)? nPos:"4px")+"px";
    } else {
      controller.infoElement.style.bottom = "4px";
    }
  };
  
})();

window.addEventListener( "resize", view.updateScreenPosition, true );