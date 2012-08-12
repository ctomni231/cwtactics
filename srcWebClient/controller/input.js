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
    { name: 'click',          from: 'mapMenu',          to:   'nothingSelected' },

    { name: 'ownProperty',    from: 'nothingSelected',  to:   'propertySelected' }
  ],

  callbacks: {

    oninit: function(){
      var appEl = document.getElementById( cwt.client.APP_CONTAINER );

      // touch
      cwt.client._initTouchEvents();
      
      cwt.client.focusTiles = [];
      for( var i=0,e=cwt.client.sw; i<e; i++ ){
      
        cwt.client.focusTiles[i] = [];
        for( var j=0,ej=cwt.client.sh; j<ej; j++ ){
        
          cwt.client.focusTiles[i][j] = false;
        }
      }
    },

    onleaveshowMovingRange: function(){
      if( cwt.DEBUG ) cwt.log.info("leaving unit selection");
      cwt.client._resetFocusTiles();
      cwt.client.selectedUnit = null;
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
      
      }catch(e){ cwt.log.error( e.message ); }
    },

    onunitMenu: function( event, from, to, selected, x, y ){
      // actions = cwt.action.unitActions( cwtwc.sObj, x, y );
    },

    onunitSelected: function( x, y ){
      //
    }
  }
});

cwt.client._resetFocusTiles = function(){
  for( var i=0,e=cwt.client.sw; i<e; i++ ){
    for( var j=0,ej=cwt.client.sh; j<ej; j++ ){
      cwt.client.focusTiles[i][j] = false;
      cwt.client.drawnMap[i][j] = true;
    }
  }
  cwt.client.drawChanges = 1;
};

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

  }
  else cwt.log.error("state {0} is not usable for a click", cState );

  /*

  if( cwt.client.selectedUnit !== null ){

    actions = cwt.action.unitActions( cwt.client.selectedUnit, x, y );

  } else{

    var unit = cwt.model.unitIdByPos( x, y );
    if( unit !== -1 ){
      cwt.client.selectedUnit = unit;
      if( cwt.DEBUG ) cwt.log.info( "showing move range" );
    }
    else actions = cwt.action.mapActions( x, y );
  }

  if( actions !== undefined ){
    if( cwt.DEBUG ) cwt.log.info( "actions: "+JSON.stringify( actions ) );

    cwtwc.showMenu( actions,x,y );
  }
  else if( cwt.DEBUG ) cwt.log.info( "actions: selected an unit" );
  */
};

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
    this.drawnMap[ this.cursorX   ][ this.cursorY+1 ] = true;
    if( this.cursorX+1 < this.sw ) this.drawnMap[ this.cursorX+1 ][ this.cursorY+1 ] = true;
  }

  this.drawChanges = 1;
};

/**
 * Extracts the key code from an key event and calls the map shift
 * function of the webclient with correct arguments.
 */
cwt.client._keyboardEvent = function( event ){

  this._rerenderCursorTiles();

  switch( event.keyCode ){

    case 37:
      if( this.cursorX == 3 && this.sx > 0 ){
        this.betterMapShift(3,1);
      }
      else{
        this.cursorX--;
        if( this.cursorX < 0 ) this.cursorX = 0;
      }
      break;

    case 38:
      if( this.cursorY == 3 && this.sy > 0 ){
        this.betterMapShift(0,1);
      }
      else{
        this.cursorY--;
        if( this.cursorY < 0 ) this.cursorY = 0;
      }
      break;

    case 39:
      if( this.cursorX == this.sw-4 && this.sx < cwt.model._width-1-this.sw ){
        this.betterMapShift(1,1);
      }
      else{
        this.cursorX++;
        if( this.cursorX >= this.sw ) this.cursorX = this.sw-1;
      }
      break;

    case 40:
      if( this.cursorY == this.sh-4 && this.sy < cwt.model._height-1-this.sh ){
        this.betterMapShift(2,1);
      }
      else{
        this.cursorY++;
        if( this.cursorY >= this.sh ) this.cursorY = this.sh-1;
      }
      break;
  }
};

/**
 * Initializes the touch events.
 *
 * @private
 */
cwt.client._initTouchEvents = function(){

  var hammer = new Hammer( document.getElementById( cwt.client.APP_CONTAINER ), {
    prevent_default: true
  });

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

    cwt.client._rerenderCursorTiles();
    cwt.client.cursorX = x;
    cwt.client.cursorY = y;

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
  hammer.onrelease = function( ev ){
  };
}