signal.connect( signal.EVENT_CLIENT_INIT, function(){
  var appEl = document.getElementById( client.ID_APP_DIV );
  var hammer = new Hammer( appEl, { prevent_default: true });

  /* DRAG EVENT */
  hammer.ondragend = function(ev){
    if( controller.currentState === controller.STATE_SELECT_MOVE_PATH ){

      var x = cDisX+ parseInt( cDisTouchX / screen.tileSizeX, 10 );
      var y = cDisY+ parseInt( cDisTouchY / screen.tileSizeY, 10 );

      userInput.invokeActionAt( x, y );

      cDisX = -1;
      cDisY = -1;
      cDisTouchX = 0;
      cDisTouchY = 0;
    }
    else{

      // get direction
      var a = ev.angle;
      var d = 0;

      if( a >= -135 && a < -45  ) d = 0;
      else if( a >= -45  && a < 45   ) d = 1;
      else if( a >= 45   && a < 135  ) d = 2;
      else if( a >= 135  ||
        a < -135 ) d = 3;

      // get distance
      var dis = parseInt( ev.distance/32, 10 );
      if( dis === 0 ) dis = 1;

      userInput.betterMapShift( d, dis );
    }
  };

  /* TAP EVENT */
  hammer.ontap = function(ev) {
    var cv = document.getElementById( client.ID_CANVAS );
    var x = ev.position[0].x - cv.offsetLeft;
    var y = ev.position[0].y - cv.offsetTop;

    sound.enable();

    if( x < 0 ) x = 0;
    if( y < 0 ) y = 0;

    x = parseInt( x / screen.tileSizeX, 10 );
    y = parseInt( y / screen.tileSizeY, 10 );

    //var x = parseInt( ev.position[0].x/client.tileSizeX, 10 );
    //var y = parseInt( ev.position[0].y/client.tileSizeY, 10 );

    /*
    if( client.cursorX !== x ||
      client.cursorY !== y ){
      client.cursorX = x;
      client.cursorY = y;
    }*/

    // convert screen to real position
    x = x+ screen.screenX;
    y = y+ screen.screenY;

    userInput.invokeActionAt( x, y );

    // PREPARE DRAG SELECTION
    if( controller.currentState === controller.STATE_SELECT_MOVE_PATH ){
      cDisX = x;
      cDisY = y;
    }
  };

  /* HOLD TOUCH EVENT */
  hammer.onhold = function( ev ){
    userInput.invokeCancel();
  };

  /* RELEASE TOUCH EVENT */
  hammer.onrelease = function(){

  };

  var cDisX = 0;
  var cDisY = 0;
  var cDisTouchX = 0;
  var cDisTouchY = 0;
  hammer.ondrag = function( ev ){
    if( userInput.currentState === userInput.STATE_SELECT_MOVE_PATH ){

      var cv = document.getElementById( client.ID_CANVAS );

      var disX = ev.distanceX - cv.offsetLeft;
      var disY = ev.distanceY - cv.offsetTop;
      cDisTouchX = disX;
      cDisTouchY = disY;

      var x = cDisX+ parseInt( disX/ screen.tileSizeX, 10 );
      var y = cDisY+ parseInt( disY/ screen.tileSizeY, 10 );

      userInput.appendToCurrentMovePath(x,y);
    }
  };

  document.onkeydown = function( ev ){
    var code = ev.keyCode;
    switch( code ){
      case 37: userInput.betterMapShift(3,1); break;
      case 38: userInput.betterMapShift(0,1); break;
      case 39: userInput.betterMapShift(1,1); break;
      case 40: userInput.betterMapShift(2,1); break;
    }
  };

  document.getElementById( client.ID_CANVAS ).onmousemove = function(ev){
    var cv = document.getElementById( client.ID_CANVAS );
    var x = ev.clientX - cv.offsetLeft;
    var y = ev.clientY - cv.offsetTop;

    if( x < 0 ) x = 0;
    if( y < 0 ) y = 0;

    x = parseInt( x / screen.tileSizeX, 10 );
    y = parseInt( y / screen.tileSizeY, 10 );

    if( controller.currentState === controller.STATE_SELECT_MOVE_PATH ){
        userInput.appendToCurrentMovePath(x,y);
    }
  }

});