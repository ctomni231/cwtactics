/**
 * Holds the current selected unit by the client.
 */
cwt.client.selectedUnit = null;

cwt.client.focusTiles = null;

/**
 * Input controller that handles all incoming user inputs.
 */
cwt.client.inputController = StateMachine.create({

  initial: 'off',

  error: function(eventName, from, to, args, errorCode, errorMessage) {
    if( cwt.DEBUG ){
      cwt.log.info("illegal transition in input handler at state '"+from+"' via event '"+eventName+"' WITH ERROR: " + errorMessage );
    }

    return "";
  },

  events: [

    { name: 'init',           from: 'off',              to:   'nothingSelected' },

    { name: 'tile',           from: 'nothingSelected',  to:   'mapMenu' },
    { name: 'ownUnit',        from: 'nothingSelected',  to:   'showMovingRange' },
    { name: 'enemyUnit',      from: 'nothingSelected',  to:   'showActingRange' },
    { name: 'alliedUnit',     from: 'nothingSelected',  to:   'showActingRange' },
    { name: 'hold',           from: 'nothingSelected',  to:   'nothingSelected' },

    { name: 'tile',           from: 'showMovingRange',  to:   'unitMenu' },
    { name: 'ownProperty',    from: 'showMovingRange',  to:   'unitMenu' },
    { name: 'enemyProperty',  from: 'showMovingRange',  to:   'unitMenu' },
    { name: 'hold',           from: 'showMovingRange',  to:   'nothingSelected' },

    { name: 'click',          from: 'unitMenu',         to:   'nothingSelected' },
    { name: 'cancel',         from: 'unitMenu',         to:   'nothingSelected' },
    { name: 'click',          from: 'mapMenu',          to:   'nothingSelected' },
    { name: 'cancel',         from: 'mapMenu',          to:   'nothingSelected' },

    { name: 'ownProperty',    from: 'nothingSelected',  to:   'propertySelected' },
    
    
    { name: 'devBack',         from: '*',               to:   'nothingSelected' }

  ],

  callbacks: {

    oninit: function(){
      var appEl = document.getElementById( cwt.client.APP_CONTAINER );

      cwt.client._initMouseEvents();

      // touch
      cwt.client._initTouchEvents();
      
      cwt.client.focusTiles = [];
      for( var i=0,e=100; i<e; i++ ){
      
        cwt.client.focusTiles[i] = [];
        for( var j=0,ej=100; j<ej; j++ ){
        
          cwt.client.focusTiles[i][j] = false;
        }
      }
    },

    onleaveshowMovingRange: function( event, from, to ){
      if( cwt.DEBUG ) cwt.log.info("leaving unit selection");
      
      if( to !== 'unitMenu' ){
          cwt.client._resetFocusTiles();
          cwt.client.selectedUnit = null;
      }
    },

    onmapMenu: function( event, from, to, x, y ){
      cwt.client.menuController.show( cwt.action.mapActions( x, y ), x, y );
    },
    
    onshowMovingRange: function( event, from, to, x, y, unitId, unit ){
      try{
      
        cwt.client.selectedUnit = unit;
        var mvBlock = cwt.move.createMoveCard( unitId, x, y ).moveMap;

        cwt.client._resetFocusTiles();
        var keysX = Object.keys( mvBlock );
        
        for( var x=0,xe=keysX.length; x<xe; x++ ){

          var kx = parseInt( keysX[x] , 10);
          var keysY = Object.keys( mvBlock[kx] );
          for( var y=0,ye=keysY.length; y<ye; y++ ){
            var ky = parseInt( keysY[y] , 10);

            cwt.client.focusTiles[kx][ky] = true;
          }
        }
        
      }
      catch(e){
        cwt.log.error( e.message );
      }
    },

    onunitMenu: function( event, from, to, selected, x, y, sx, sy ){
      if( from === 'showMovingRange' ){
          if( cwt.client.focusTiles[x][y] === false ){
              this.cancel();
          }
          else{
              var unit = cwt.model.unit(selected);
              var card = cwt.move.createMoveCard( selected, unit.x, unit.y );
              var path = cwt.move.returnPath( selected, unit.x, unit.y, x, y , card );
              card.way = path;
              
              cwt.move.move( card );
              
              cwt.client.drawnMap[ unit.x-cwt.client.sx ][ unit.y-cwt.client.sy ] = true;
              cwt.client._resetFocusTiles();
              cwt.client.menuController.show( cwt.action.unitActions( selected, x, y ), x, y );
          }
      }
      else{
          // cwt.client._resetFocusTiles();
          cwt.client.menuController.show( cwt.action.unitActions( selected, x, y ), x, y );
      }
    },

    onunitSelected: function( x, y ){
      //
    }
  }
});

/**
 *
 *
 * @param x
 * @param y
 */
cwt.client.click = function(x,y){
  var actions;
  var cState = cwt.client.inputController.current;

  if( cwt.DEBUG ) cwt.log.info("click at ("+x+","+y+")");

  if( cState === "nothingSelected" ){                               // NOTHING

    var unitId = cwt.model.unitIdByPos( x, y );
    if( unitId !== -1 ){                                            // UNIT SELECTION ?

      var unit = cwt.model.unit( unitId );
      cwt.client.inputController.ownUnit( x, y, unitId, unit );
    }
    else{                                                           // PROPERTY SELECTION ?

      // MAP SELECTION
      cwt.client.inputController.tile( x, y );
    }
  }
  else if( cState === "showMovingRange" ){                          // RANGE VISIBLE

    // MAP SELECTION
    cwt.client.inputController.tile( cwt.model.unitId(cwt.client.selectedUnit) , x, y );
  }
  else cwt.log.error("state {0} is not usable for a click", cState );
};

/**
 * Erases the focus tiles and invokes a rerender of the
 * focussed tile in the next draw tick.
 *
 * @private
 */
cwt.client._resetFocusTiles = function(){
  for( var i=0,e=cwt.model._width; i<e; i++ ){
    for( var j=0,ej=cwt.model._height; j<ej; j++ ){
      
      if( cwt.client.focusTiles[i][j] === true ){
          if( i >= cwt.client.sx && i < cwt.client.sx+cwt.client.sw &&
              j >= cwt.client.sy && j < cwt.client.sy+cwt.client.sh ){
              
            cwt.client.drawnMap[i-cwt.client.sx][j-cwt.client.sy] = true;
          }
          
          cwt.client.focusTiles[i][j] = false;
      }
    }
  }
  cwt.client.drawChanges = 1;
};

/**
 * @private
 */
cwt.client._rerenderCursorTiles = function(){

  if( this.cursorY-1 >= 0 ){
    if( this.cursorX-1 >= 0 )      this.drawnMap[ this.cursorX-1 ][ this.cursorY-1 ] = true;
    this.drawnMap[ this.cursorX   ][ this.cursorY-1 ] = true;
    if( this.cursorX+1 < this.sw ) this.drawnMap[ this.cursorX+1 ][ this.cursorY-1 ] = true;
  }

  if( this.cursorX-1 >= 0 )      this.drawnMap[ this.cursorX-1 ][ this.cursorY   ] = true;
  this.drawnMap[ this.cursorX   ][ this.cursorY   ] = true;
  if( this.cursorX+1 < this.sw ) this.drawnMap[ this.cursorX+1 ][ this.cursorY   ] = true;

  if( this.cursorY+1 < this.sh ){
    if( this.cursorX-1 >= 0 )      this.drawnMap[ this.cursorX-1 ][ this.cursorY+1 ] = true;
    this.drawnMap[ this.cursorX ][ this.cursorY+1 ] = true;
    if( this.cursorX+1 < this.sw ) this.drawnMap[ this.cursorX+1 ][ this.cursorY+1 ] = true;
  }

  this.drawChanges = 1;
};

/**
 * Extracts the key code from an key event and calls the map shift
 * function of the webclient with correct arguments.
 *
 * @private
 */
cwt.client._keyboardEvent = function( event ){

  switch( event.keyCode ){

    // LEFT
    case 37:
      this._rerenderCursorTiles();
      if( this.cursorX == 3 && this.sx > 0 ){
        this.betterMapShift(3,1);
      }
      else{
        this.cursorX--;
        if( this.cursorX < 0 ) this.cursorX = 0;
      }
      break;

    // UP
    case 38:
      this._rerenderCursorTiles();
      if( this.cursorY == 3 && this.sy > 0 ){
        this.betterMapShift(0,1);
      }
      else{
        this.cursorY--;
        if( this.cursorY < 0 ) this.cursorY = 0;
      }
      break;

    // RIGHT
    case 39:
      this._rerenderCursorTiles();
      if( this.cursorX == this.sw-4 && this.sx < cwt.model._width-1-this.sw ){
        this.betterMapShift(1,1);
      }
      else{
        this.cursorX++;
        if( this.cursorX >= this.sw ) this.cursorX = this.sw-1;
      }
      break;

    // DOWN
    case 40:
      this._rerenderCursorTiles();
      if( this.cursorY == this.sh-4 && this.sy < cwt.model._height-1-this.sh ){
        this.betterMapShift(2,1);
      }
      else{
        this.cursorY++;
        if( this.cursorY >= this.sh ) this.cursorY = this.sh-1;
      }
      break;

    // BACKSPACE
    case 8:
      cwt.client.inputController.hold();
      break;

    // ENTER
    case 13:
      cwt.client.click( cwt.client.sx+this.cursorX, cwt.client.sy+this.cursorY );
      break;
  }
};

/**
 * Initializes the mouse events.
 *
 * @private
 */
cwt.client._initMouseEvents = function(){
  var appEl = document.getElementById( cwt.client.APP_CONTAINER );

  /* MOUSE MOVE */
  appEl.onmousemove = function(ev){
    var x = parseInt( ev.pageX / cwt.client.tx, 10 );
    var y = parseInt( ev.pageY / cwt.client.ty, 10 );

    // check boundaries
    if( x < cwt.client.sw && y < cwt.client.sh ){

      if( cwt.client.cursorX !== x || cwt.client.cursorY !== y ){
        cwt.client._rerenderCursorTiles();
        cwt.client.cursorX = x;
        cwt.client.cursorY = y;
      }
    }
  }

    // MOUSE BUTTON_HOLD, BUTTON_CLICK ETC. WILL BE DONE
    // BY HAMMER.JS
};

/**
 * Initializes the touch events.
 *
 * @private
 */
cwt.client._initTouchEvents = function(){
  var hammer = new Hammer( document.getElementById( cwt.client.APP_CONTAINER ), { prevent_default: true });

  /* DRAG EVENT */
  hammer.ondragend = function(ev){

    // get direction
    var a = ev.angle;
    var d = 0;
    if( a >= -135 && a < -45  ) d = 0;
    else if( a >= -45  && a < 45   ) d = 1;
    else if( a >= 45   && a < 135  ) d = 2;
    else if( a >= 135  || a < -135 ) d = 3;

    // get distance
    var dis = parseInt( ev.distance/32, 10 );
    if( dis === 0 ) dis = 1;

    cwt.client.betterMapShift( d, dis );
  };

  /* TAP EVENT */
  hammer.ontap = function(ev) {
    var x = parseInt( ev.position[0].x / cwt.client.tx, 10 );
    var y = parseInt( ev.position[0].y / cwt.client.ty, 10 );

    if( cwt.client.cursorX !== x || cwt.client.cursorY !== y ){
      cwt.client._rerenderCursorTiles();
      cwt.client.cursorX = x;
      cwt.client.cursorY = y;
    }

    // convert screen to real position
    x = x+ cwt.client.sx;
    y = y+ cwt.client.sy;

    cwt.client.click( x,y );
  };

  /* HOLD TOUCH EVENT */
  hammer.onhold = function(ev) {
    var x = parseInt( ev.position[0].x / cwt.client.tx, 10 );
    var y = parseInt( ev.position[0].y / cwt.client.ty, 10 );

    cwt.client.inputController.hold();
  };

  /* RELEASE TOUCH EVENT */
  hammer.onrelease = function( ev ){};
};