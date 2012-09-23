/**
 * Holds the current selected unit by the client.
 */
cwtwc.selectedUnit = null;

/**
 * Holds markers for tiles that will be shown as focussed
 * (move map, attack range or commander range).
 */
cwtwc.focusTiles = null;

cwtwc._initInput = function(){
  var appEl = document.getElementById( cwtwc.APP_CONTAINER );

  cwtwc._initMouseEvents(appEl);
  cwtwc._initTouchEvents(appEl);

  // react on state changes
  cwt.input.addStateChangeListener( cwtwc._stateChangelistener );

  cwtwc.focusTiles = cwt.util.matrix(100, 100, false);
};

/**
 * @private
 */
cwtwc._stateChangelistener = function( state, oldState, event ){

  // OLD STATE
  switch( oldState ){

    // MENU
    case 'UnitActions' :
    case 'MapActions' :
    case 'FactoryActions' :

      if( event === 'back' || event === 'doAction' ){
        cwtwc.menuController.hide();
      }

      break;
  }

  // TO STATE
  switch( state ){
  
    // hide move tiles after releasing unit selection
    case 'NoSelection' :
      cwtwc._resetFocusTiles();
      break;
      
    // show move tiles
    case 'UnitMoveMap' :
      // var mvBlock = cwt.input.movemap.moveMap;
      var card = cwt.input.movemap;
      var cost;
      
      for( var mvsX=card.moveMapX,
               mvsXe=card.moveMapX+(cwt.MAX_MOVE_RANGE*2+1) ; mvsX<mvsXe; mvsX++ ){
        
        for( var mvsY=card.moveMapY,
                 mvsYe=card.moveMapY+(cwt.MAX_MOVE_RANGE*2+1) ; mvsY<mvsYe; mvsY++ ){

          cost = cwt.moveCostsForPos( card, mvsX, mvsY );
          if( cost > 0 ){

            // set focus
            cwtwc.focusTiles[mvsX][mvsY] = true;

            // mark for redraw
            if( mvsX >= cwtwc.sx && mvsX < cwtwc.sx+cwtwc.sw &&
                mvsY >= cwtwc.sy && mvsY < cwtwc.sy+cwtwc.sh    ){

              cwtwc.drawnMap[mvsX-cwtwc.sx][mvsY-cwtwc.sy] = true;
            }

            cwtwc.drawChanges = 1;
          }
        }
      }

      break;

    case 'UnitSelection':
      cwt.input.showMoveMap();
      break;
      
    // MENU
    case 'UnitActions' :
    case 'MapActions' :
    case 'FactoryActions' :
      cwtwc.menuController.show(
        cwt.input.actions,
        cwtwc.cursorX, cwtwc.cursorY
      );
      break;
  } 
};

/**
 * @param x
 * @param y
 */
cwtwc.click = function(x,y){
  if( cwt.DEBUG ){
    cwt.info("got a click at tile {0},{1}", x, y );
  }

  if( cwt.input.current === 'UnitMoveMap' ){
    if( cwt.moveCostsForPos( cwt.input.movemap, x, y ) > 0 ){

      var card = cwt.input.movemap;
      card.way = cwt.returnPath( card.uid, card.x, card.y, x, y, card );
      cwt.input.showActionMap(x,y);
    }
    else{

      cwtwc.back(x,y);
    }
  }
  else{
    var unitId = cwt.tileOccupiedByUnit(x,y);
    if( unitId !== false && cwt.canAct(unitId) ){

      // UNIT SELECTION
      cwt.input.unitSelected( unitId );
    }
    else{

      var propId = cwt.tileIsProperty(x,y);
      if( propId !== false ){

        // FACTORY SELECTION
        cwt.input.factorySelected( propId );
      }
      else{

        // MAP SELECTION
        cwt.input.mapSelected( x, y );
      }
    }
  }
};

cwtwc.back = function(x,y){
  cwt.input.back();
};

/**
 * Erases the focus tiles and invokes a rerender of the
 * focussed tile in the next draw tick.
 *
 * @private
 */
cwtwc._resetFocusTiles = function(){
  for( var i=0,e=cwt.mapWidth; i<e; i++ ){
    for( var j=0,ej=cwt.mapHeight; j<ej; j++ ){
      
      if( cwtwc.focusTiles[i][j] === true ){
          if( i >= cwtwc.sx && i < cwtwc.sx+cwtwc.sw &&
              j >= cwtwc.sy && j < cwtwc.sy+cwtwc.sh ){

            cwtwc.drawnMap[i-cwtwc.sx][j-cwtwc.sy] = true;
          }

          cwtwc.focusTiles[i][j] = false;
      }
    }
  }
  cwtwc.drawChanges = 1;
};

/**
 * @private
 */
cwtwc._rerenderCursorTiles = function(){

  if( cwtwc.cursorY-1 >= 0 ){
    if( cwtwc.cursorX-1 >= 0 )      cwtwc.drawnMap[ cwtwc.cursorX-1 ][ cwtwc.cursorY-1 ] = true;
    cwtwc.drawnMap[ cwtwc.cursorX   ][ cwtwc.cursorY-1 ] = true;
    if( cwtwc.cursorX+1 < cwtwc.sw ) cwtwc.drawnMap[ cwtwc.cursorX+1 ][ cwtwc.cursorY-1 ] = true;
  }

  if( cwtwc.cursorX-1 >= 0 )      cwtwc.drawnMap[ cwtwc.cursorX-1 ][ cwtwc.cursorY   ] = true;
  cwtwc.drawnMap[ cwtwc.cursorX   ][ cwtwc.cursorY   ] = true;
  if( cwtwc.cursorX+1 < cwtwc.sw ) cwtwc.drawnMap[ cwtwc.cursorX+1 ][ cwtwc.cursorY   ] = true;

  if( cwtwc.cursorY+1 < cwtwc.sh ){
    if( cwtwc.cursorX-1 >= 0 )      cwtwc.drawnMap[ cwtwc.cursorX-1 ][ cwtwc.cursorY+1 ] = true;
    cwtwc.drawnMap[ cwtwc.cursorX ][ cwtwc.cursorY+1 ] = true;
    if( cwtwc.cursorX+1 < cwtwc.sw ) cwtwc.drawnMap[ cwtwc.cursorX+1 ][ cwtwc.cursorY+1 ] = true;
  }

  // mark redraw wish
  cwtwc.drawChanges = 1;
};

/**
 * Extracts the key code from an key event and calls the map shift
 * function of the webclient with correct arguments.
 *
 * @private
 */
cwtwc._keyboardEvent = function( event ){

  switch( event.keyCode ){

    // LEFT
    case 37:
      cwtwc._rerenderCursorTiles();
      if( cwtwc.cursorX == 3 && cwtwc.sx > 0 ){
        cwtwc.betterMapShift(3,1);
      }
      else{
        cwtwc.cursorX--;
        if( cwtwc.cursorX < 0 ) cwtwc.cursorX = 0;
      }
      break;

    // UP
    case 38:
      cwtwc._rerenderCursorTiles();
      if( cwtwc.cursorY == 3 && cwtwc.sy > 0 ){
        cwtwc.betterMapShift(0,1);
      }
      else{
        cwtwc.cursorY--;
        if( cwtwc.cursorY < 0 ) cwtwc.cursorY = 0;
      }
      break;

    // RIGHT
    case 39:
      this._rerenderCursorTiles();
      if( cwtwc.cursorX == cwtwc.sw-4 && cwtwc.sx < cwtwc.mapWidth-1-cwtwc.sw ){
        cwtwc.betterMapShift(1,1);
      }
      else{
        cwtwc.cursorX++;
        if( cwtwc.cursorX >= cwtwc.sw ) cwtwc.cursorX = cwtwc.sw-1;
      }
      break;

    // DOWN
    case 40:
      this._rerenderCursorTiles();
      if( cwtwc.cursorY == cwtwc.sh-4 && cwtwc.sy < cwt.mapHeight-1-cwtwc.sh ){
        cwtwc.betterMapShift(2,1);
      }
      else{
        cwtwc.cursorY++;
        if( cwtwc.cursorY >= cwtwc.sh ) cwtwc.cursorY = cwtwc.sh-1;
      }
      break;

    // BACKSPACE
    case 8:
      cwtwc.back();
      break;

    // ENTER
    case 13:
      cwtwc.click( cwtwc.sx+ cwtwc.cursorX, cwtwc.sy+ cwtwc.cursorY );
      break;
  }
};

/**
 * Initializes the mouse events.
 *
 * @private
 */
cwtwc._initMouseEvents = function( appEl ){

  /* MOUSE MOVE */
  appEl.onmousemove = function (ev) {
    var x = parseInt( ev.pageX / cwtwc.tx, 10);
    var y = parseInt( ev.pageY / cwtwc.ty, 10);

    // check boundaries
    if (x < cwtwc.sw && y < cwtwc.sh) {

      if ( cwtwc.cursorX !== x || cwtwc.cursorY !== y) {

        // TODO: think about this, because cursor is dropped in m1
        cwtwc._rerenderCursorTiles();
        cwtwc.cursorX = x;
        cwtwc.cursorY = y;
      }
    }
  };

  // MOUSE BUTTON_HOLD, BUTTON_CLICK ETC. WILL BE DONE BY HAMMER.JS
};

/**
 * Initializes the touch events.
 *
 * @private
 */
cwtwc._initTouchEvents = function( appEl ){};