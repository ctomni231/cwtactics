/**
 * X coordinate of the cursor.
 */
controller.mapCursorX = 0;

/**
 * Y coordinate of the cursor.
 */
controller.mapCursorY = 0;

controller.mapTargetCursorX = 0;

controller.mapTargetCursorY = 0;

/**
 *
 */
controller.resetMapCursor = function(){
  controller.mapCursorX = 0;
  controller.mapCursorY = 0;
};

/**
 *
 * @param isCancel if true then it is a cancel action
 */
controller.cursorAction = function( isCancel ){
  
  // BREAK IF YOU ARE IN THE ANIMATION PHASE
  if( controller.inAnimationHookPhase() ) return;
  
  var bstate = controller.stateMachine.state;
  var bfocus = ( bstate === "MOVEPATH_SELECTION" ||
                bstate === "IDLE_R" ||
                bstate === "ACTION_SELECT_TARGET_A" ||
                bstate === "ACTION_SELECT_TARGET_B" );
  
  // INVOKE ACTION
  if( isCancel ){
    controller.stateMachine.event("cancel", controller.mapCursorX, controller.mapCursorY );
  }
  else{
    if( controller.menuCursorIndex !== -1 ){
      controller.stateMachine.event( "action",controller.menuCursorIndex );
    }
    else {
      controller.stateMachine.event( "action", controller.mapCursorX, controller.mapCursorY );
    }
  }
  
  var astate = controller.stateMachine.state;
  var afocus = ( astate === "MOVEPATH_SELECTION" ||
                astate === "IDLE_R" ||
                astate === "ACTION_SELECT_TARGET_A" ||
                astate === "ACTION_SELECT_TARGET_B"  );
  
  // RERENDERING
  if( ( bfocus && !afocus ) || afocus ){
    view.markSelectionMapForRedraw( controller.stateMachine.data );
  }
  
  // MENU
  if( astate === "ACTION_MENU" || astate === "ACTION_SUBMENU" ){
    
    var menu = controller.stateMachine.data.menu;
    controller.showMenu(
      menu,
      controller.mapCursorX,
      controller.mapCursorY
    );
  }
  else{
    if( bstate === "ACTION_MENU" || bstate === "ACTION_SUBMENU" ) controller.hideMenu();
  }
};

/**
 *
 */
controller.cursorActionCancel = function(){
  controller.cursorAction(true);
  controller.audio_playSound("CANCEL");
};

/**
 *
 */
controller.cursorActionClick = function(){
  controller.cursorAction(false);
  controller.audio_playSound("ACTION");
};

/**
 *
 * @param dir
 * @param len
 */
controller.moveCursor = function( dir, len ){
  if( arguments.length === 1 ) len = 1;
  
  controller.eraseWantedCursorPosition();
  
  var x = controller.mapCursorX;
  var y = controller.mapCursorY;
  
  switch( dir ){
    case model.move_MOVE_CODES.UP    : y--; break;
    case model.move_MOVE_CODES.RIGHT : x++; break;
    case model.move_MOVE_CODES.DOWN  : y++; break;
    case model.move_MOVE_CODES.LEFT  : x--; break;
  }
  
  controller.setCursorPosition(x,y);
};

controller.setWantedCursorPosition = function(x,y){
  controller.mapTargetCursorX = x;
  controller.mapTargetCursorY = y;
};

controller.eraseWantedCursorPosition = function(x,y){
  controller.mapTargetCursorX = -1;
  controller.mapTargetCursorY = -1;
};

/**
 * Moves the cursor to a given position. The view will be moved as well with
 * this function to make sure that the cursor is on the visible view.
 *
 * @param tx
 * @param ty
 */
controller.setCursorPosition = function( x,y,relativeToScreen ){  
  if( controller.isMenuOpen() ) return;
  
  if( relativeToScreen ){
    x = x + controller.screenX;
    y = y + controller.screenY;
  }
  
  //if( CLIENT_DEBUG ){
  if( !model.map_isValidPosition(x,y) ){
    //util.illegalPositionError();
    return ; // TODO
  }
  //}
  
  if( x === controller.mapCursorX && y === controller.mapCursorY ) return;
    
  // CLEAN OLD
  view.markForRedraw( controller.mapCursorX, controller.mapCursorY );
  if( controller.mapCursorY < model.map_height -1 ) view.markForRedraw( controller.mapCursorX, controller.mapCursorY+1 );
  
  controller.audio_playSound("MAPTICK");
  view.markForRedraw( controller.mapCursorX, controller.mapCursorY );
  
  controller.mapCursorX = x;
  controller.mapCursorY = y;
  
  controller.updateSimpleTileInformation();
  
  var scale = controller.screenScale;  
  if( scale === 0 ) scale = 0.8;
  else if( scale === -1 ) scale = 0.7;
  
  var scw = parseInt( parseInt( (window.innerWidth-80)/16,10 ) / scale ,10 );
  var sch = parseInt( parseInt( (window.innerHeight-80)/16,10 ) / scale ,10 );

  // shift tile information panel if necessary
  if( controller.sideSimpleTileInformationPanel < 0 && (x-controller.screenX) <  (scw*0.25) ) controller.moveSimpleTileInformationToRight();
  if( controller.sideSimpleTileInformationPanel > 0 && (x-controller.screenX) >= (scw*0.75) ) controller.moveSimpleTileInformationToLeft();
  
  // extract move code
  var moveCode = -1;
  if( x-controller.screenX <= 1 )          moveCode = model.move_MOVE_CODES.LEFT;
  else if( x-controller.screenX >= scw-1 ) moveCode = model.move_MOVE_CODES.RIGHT;
  else if( y-controller.screenY <= 1 )     moveCode = model.move_MOVE_CODES.UP;
  else if( y-controller.screenY >= sch-1 ) moveCode = model.move_MOVE_CODES.DOWN;
  
  // shift screen of you're reach a border
  if( moveCode !== -1 ){
    controller.shiftScreenPosition( moveCode, 5 );
  }
  
  if( DEBUG ){
    util.log(
      "set cursor position to",
      x,y,
      "screen node is at",
      controller.screenX,controller.screenY
    );
  }
  
  view.markForRedraw( x,y );
};