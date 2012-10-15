cwt.defineLayer( CWT_LAYER_CLIENT,
  function( client, userAction, data, util, persistence){

    client.initializeTouch = function( ){
      var appEl = document.getElementById( client.ID_APP_DIV );
      var hammer = new Hammer( appEl, { prevent_default: true });

      /* DRAG EVENT */
      hammer.ondragend = function(ev){
        if( userAction.currentState() === userAction.STATE_SELECT_MOVE_PATH ){
          var x = cDisX+ parseInt( cDisTouchX/client.tileSizeX, 10 );
          var y = cDisY+ parseInt( cDisTouchY/client.tileSizeY, 10 );

          client.invokeActionAt( x, y );

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

          client.betterMapShift( d, dis );
        }
      };

      /* TAP EVENT */
      hammer.ontap = function(ev) {
        var x = parseInt( ev.position[0].x/client.tileSizeX, 10 );
        var y = parseInt( ev.position[0].y/client.tileSizeY, 10 );

        if( client.cursorX !== x ||
          client.cursorY !== y ){
          client.cursorX = x;
          client.cursorY = y;
        }

        // convert screen to real position
        x = x+ client.screenX;
        y = y+ client.screenY;

        client.invokeActionAt( x, y );

        // PREPARE DRAG SELECTION
        if( userAction.currentState() === userAction.STATE_SELECT_MOVE_PATH ){
          cDisX = x;
          cDisY = y;
        }
      };

      /* HOLD TOUCH EVENT */
      hammer.onhold = function( ev ){
        var x = parseInt( ev.position[0].x/ client.tileSizeX, 10 );
        var y = parseInt( ev.position[0].y/ client.tileSizeY, 10 );

        client.invokeCancel();
      };

      /* RELEASE TOUCH EVENT */
      hammer.onrelease = function(){

      };

      var cDisX = 0;
      var cDisY = 0;
      var cDisTouchX = 0;
      var cDisTouchY = 0;
      hammer.ondrag = function( ev ){
        if( userAction.currentState() === userAction.STATE_SELECT_MOVE_PATH ){
          var disX = ev.distanceX;
          var disY = ev.distanceY;
          cDisTouchX = disX;
          cDisTouchY = disY;

          var x = cDisX+ parseInt( disX/client.tileSizeX, 10 );
          var y = cDisY+ parseInt( disY/client.tileSizeY, 10 );

          client.appendToCurrentMovePath(x,y);
        }
      };

      document.onkeydown = function( ev ){
        util.logInfo("got key event");

        var code = ev.keyCode;
        switch( code ){
          case 37: client.betterMapShift(3,1); break;
          case 38: client.betterMapShift(0,1); break;
          case 39: client.betterMapShift(1,1); break;
          case 40: client.betterMapShift(2,1); break;
        }
      };

      var isIE = document.all ? true : false;
      var tempX = 0;
      var tempY = 0;
      function getMouseXY(e) {
        if( isIE ) { // grab the x-y pos.s if browser is IE
          tempX = event.clientX + document.body.scrollLeft;
          tempY = event.clientY + document.body.scrollTop;
        }
        else {  // grab the x-y pos.s if browser is NS
          tempX = e.pageX;
          tempY = e.pageY;
        }

        if (tempX < 0){ tempX = 0; }
        if (tempY < 0){ tempY = 0; }

        return true;
      }

      document.getElementById( client.ID_APP_DIV ).onmousemove = function(ev){
        var x = parseInt( ev.clientX / client.tileSizeX, 10 );
        var y = parseInt( ev.clientY / client.tileSizeY, 10 );

        if( userAction.currentState() === userAction.STATE_SELECT_MOVE_PATH ){
          client.appendToCurrentMovePath(x,y);
        }
      }

    }
  });