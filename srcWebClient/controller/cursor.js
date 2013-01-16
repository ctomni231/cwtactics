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

/**
 *
 */
controller.increaseMenuCursor = function(){
  controller.menuCursorIndex++;
};

/**
 *
 */
controller.decreaseMenuCursor = function(){
  controller.menuCursorIndex--;
  if( controller.menuCursorIndex < 0 ) controller.menuCursorIndex = 0;
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
 */
controller.cursorActionCancel = function(){
  if( controller.currentAnimatedKey !== null ) return;
  var state;
  var focusExists = (
    controller.input.state() === "MOVEPATH_SELECTION" ||
      controller.input.state() === "ACTION_SELECT_TARGET"
    );

  controller.input.event("cancel");

  var focusExistsAfter = (
    controller.input.state() === "MOVEPATH_SELECTION" ||
      controller.input.state() === "ACTION_SELECT_TARGET"
    );

  if( (focusExists && !focusExistsAfter ) || focusExistsAfter ){
    view.markSelectionMapForRedraw( controller.input.selectionData );
  }

  state = controller.input.state();
  if( state === "ACTION_MENU" || state === "ACTION_SUBMENU" ){

    var menu = controller.input.menu;
    if( controller.input.actionData.getAction() === 'unloadUnit' ){
      var old = menu;
      menu = [];
      for( var i=0, e=controller.input.menuSize; i<e; i++ ){
        menu[i] = model.units[ old[i] ].type;
      }
    }

    controller.showMenu(
      menu, controller.input.menuSize,
      controller.mapCursorX, controller.mapCursorY
    );
  }
  else{ controller.hideMenu(); }
};

/**
 *
 */
controller.cursorActionClick = function(){
  if( controller.currentAnimatedKey !== null ) return;
  var state;
  var focusExists = (
    controller.input.state() === "MOVEPATH_SELECTION" ||
      controller.input.state() === "ACTION_SELECT_TARGET"
    );

  if( controller.menuCursorIndex !== -1 ){
    controller.input.event(
      "action",controller.menuCursorIndex
    );
  }
  else{
    controller.input.event(
      "action", controller.mapCursorX, controller.mapCursorY
    );
  }


  var focusExistsAfter = (
    controller.input.state() === "MOVEPATH_SELECTION" ||
      controller.input.state() === "ACTION_SELECT_TARGET"
    );

  if(( focusExists && !focusExistsAfter ) || focusExistsAfter ){
    view.markSelectionMapForRedraw( controller.input.selectionData );
  }

  state = controller.input.state();
  if( state === "ACTION_MENU" || state === "ACTION_SUBMENU" ){

    var menu = controller.input.menu;
    if( controller.input.actionData.getAction() === 'unloadUnit' ){
      var old = menu;
      menu = [];
      for( var i=0, e=controller.input.menuSize; i<e; i++ ){
        menu[i] = model.units[ old[i] ].type;
      }
    }

    controller.showMenu(
      menu, controller.input.menuSize,
      controller.mapCursorX, controller.mapCursorY
    );
  }
  else{ controller.hideMenu(); }
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

  // TODO pre generate it if scale changes
  var scw = parseInt(
    parseInt( window.innerWidth/16,10 ) / controller.screenScale
    ,10
  );

  var sch = parseInt(
    parseInt( window.innerHeight/16,10 ) / controller.screenScale
    ,10
  );

  var moveCode = -1;
  if( x-controller.screenX <= 1 ) moveCode = model.MOVE_CODE_LEFT;
  else if( x-controller.screenX >= scw-1 ) moveCode = model.MOVE_CODE_RIGHT;
  else if( y-controller.screenY <= 1 ) moveCode = model.MOVE_CODE_UP;
  else if( y-controller.screenY >= sch-1 ) moveCode = model.MOVE_CODE_DOWN;

  if( moveCode !== -1 ){
    controller.shiftScreenPosition( moveCode, 5 );
  }

  var isLeft = (x+controller.screenX) >= scw/2;
  view.updateTileInfo( isLeft );
  view.updatePlayerInfo( isLeft );
  
  if( CLIENT_DEBUG ){
    util.logInfo(
      "set cursor position to",
      x,y,
      "screen node is at",
      controller.screenX,controller.screenY,
      "screen size is",
      scw,sch
    );
  }

  view.markForRedraw( x,y );
};
