/**
 * X coordinate of the cursor.
 */
controller.mapCursorX = 0;

/**
 * Y coordinate of the cursor.
 */
controller.mapCursorY = 0;

/**
 * Index of the current selected menu entry.
 */
controller.menuCursorIndex = -1;

/**
 *
 */
controller.resetMenuCursor = function(){
  controller.menuCursorIndex = 0;
};

controller.setMenuIndex = function( index ){
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "";    
  controller.menuCursorIndex = index;  
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "activeButton";
};

/**
 *
 */
controller.increaseMenuCursor = function(){
  
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "";
  
  controller.menuCursorIndex++;
  if( controller.menuCursorIndex === controller.stateMachine.data.menuSize ){
    controller.menuCursorIndex--;
  }
  
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "activeButton";
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].children[0].focus();
};

/**
 *
 */
controller.decreaseMenuCursor = function(){
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "";
  
  controller.menuCursorIndex--;
  if( controller.menuCursorIndex < 0 ) controller.menuCursorIndex = 0;
  
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].className = "activeButton";
  controller.menuEntryListElement.children[ controller.menuCursorIndex ].children[0].focus();
};

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
  if( controller.currentAnimatedKey !== null ) return;

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
      controller.stateMachine.data.menuSize,
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
  controller.playSfx("CANCEL");
};

/**
 *
 */
controller.cursorActionClick = function(){
  controller.cursorAction(false);
  controller.playSfx("ACTION");
};

/**
 *
 * @param dir
 * @param len
 */
controller.moveCursor = function( dir, len ){
  if( arguments.length === 1 ) len = 1;

  var x = controller.mapCursorX;
  var y = controller.mapCursorY;

  switch( dir ){
    case model.MOVE_CODE_UP    : y--; break;
    case model.MOVE_CODE_RIGHT : x++; break;
    case model.MOVE_CODE_DOWN  : y++; break;
    case model.MOVE_CODE_LEFT  : x--; break;
  }

  controller.setCursorPosition(x,y);
};


/**
 * Moves the cursor to a given position. The view will be moved as well with
 * this function to make sure that the cursor is on the visible view.
 *
 * @param tx
 * @param ty
 */
controller.setCursorPosition = function( x,y,relativeToScreen ){

  if( controller.menuElement.style.display === "block" ) return;
  
  if( relativeToScreen ){
    x = x + controller.screenX;
    y = y + controller.screenY;
  }

  //if( CLIENT_DEBUG ){
    if( !model.isValidPosition(x,y) ){
      //util.illegalPositionError();
      return ; // TODO
    }
  //}

  if( x === controller.mapCursorX && y === controller.mapCursorY ) return;

  view.markForRedraw( controller.mapCursorX, controller.mapCursorY );

  controller.mapCursorX = x;
  controller.mapCursorY = y;
  
  var scw = parseInt( parseInt( window.innerWidth/16,10 ) / controller.screenScale ,10 );
  var sch = parseInt( parseInt( window.innerHeight/16,10 ) / controller.screenScale ,10 );

  var moveCode = -1;
  if( x-controller.screenX <= 1 )          moveCode = model.MOVE_CODE_LEFT;
  else if( x-controller.screenX >= scw-1 ) moveCode = model.MOVE_CODE_RIGHT;
  else if( y-controller.screenY <= 1 )     moveCode = model.MOVE_CODE_UP;
  else if( y-controller.screenY >= sch-1 ) moveCode = model.MOVE_CODE_DOWN;

  if( moveCode !== -1 ){
    controller.shiftScreenPosition( moveCode, 5 );
  }

  if( CLIENT_DEBUG ){
    util.log(
      "set cursor position to",
      x,y,
      "screen node is at",
      controller.screenX,controller.screenY
    );
  }

  view.markForRedraw( x,y );
};
