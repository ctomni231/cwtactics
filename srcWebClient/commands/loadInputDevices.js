/** @constant */
controller.INPUT_KEYBOARD_CODE_LEFT  = 37;

/** @constant */
controller.INPUT_KEYBOARD_CODE_UP    = 38;

/** @constant */
controller.INPUT_KEYBOARD_CODE_RIGHT = 39;

/** @constant */
controller.INPUT_KEYBOARD_CODE_DOWN  = 40;

/** @constant */
controller.INPUT_KEYBOARD_CODE_BACKSPACE = 8;

/** @constant */
controller.INPUT_KEYBOARD_CODE_ENTER = 13;

/** @constant */
controller.INPUT_KEYBOARD_CODE_M = 77;

/** @constant */
controller.INPUT_KEYBOARD_CODE_N = 78;

controller.registerCommand({

  key:"loadInputDevices",

  // ------------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // ------------------------------------------------------------------------
  action: function(){

    var detect = new DeviceDetection( navigator.userAgent );

    // **************************************************************
    // KEYBOARD SUPPORT FOR DESKTOP DEVICES
    if( detect.isDesktop() ){
      //document.onkeydown = function( ev ){
      document.onkeydown = function( ev ){
        if( CLIENT_DEBUG ){
          util.logInfo("got key code",ev.keyCode);
        }

        var code = ev.keyCode;
        switch( code ){

          case controller.INPUT_KEYBOARD_CODE_LEFT:
            controller.moveCursor( model.MOVE_CODE_LEFT, 1 );
            break;

          case controller.INPUT_KEYBOARD_CODE_UP:
            controller.moveCursor( model.MOVE_CODE_UP, 1 );
            break;

          case controller.INPUT_KEYBOARD_CODE_RIGHT:
            controller.moveCursor( model.MOVE_CODE_RIGHT, 1 );
            break;

          case controller.INPUT_KEYBOARD_CODE_DOWN:
            controller.moveCursor( model.MOVE_CODE_DOWN, 1 );
            break;

          case controller.INPUT_KEYBOARD_CODE_BACKSPACE:
            controller.cursorActionCancel();
            break;

          case controller.INPUT_KEYBOARD_CODE_ENTER:
            controller.cursorActionClick();
            break;

          case controller.INPUT_KEYBOARD_CODE_M:
            if( controller.screenScale < 3 ){
              controller.setScreenScale( controller.screenScale+1 );
            }
            break;

          case controller.INPUT_KEYBOARD_CODE_N:
            if( controller.screenScale > 1 ){
              controller.setScreenScale( controller.screenScale-1 );
            }
            break;
        }

        switch( code ){
          case controller.INPUT_KEYBOARD_CODE_LEFT:
          case controller.INPUT_KEYBOARD_CODE_UP:
          case controller.INPUT_KEYBOARD_CODE_RIGHT:
          case controller.INPUT_KEYBOARD_CODE_DOWN:
          case controller.INPUT_KEYBOARD_CODE_BACKSPACE:
          case controller.INPUT_KEYBOARD_CODE_ENTER:
          case controller.INPUT_KEYBOARD_CODE_M:
          case controller.INPUT_KEYBOARD_CODE_N:
            return false;
        }
      };

    }

    // **************************************************************
    // MOUSE SUPPORT FOR DESKTOP DEVICES
    if( detect.isDesktop() ){
      var canvas = document.getElementById( "cwt_canvas" );

      function MouseWheelHandler(e){
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if( delta > 0 ){
          // ZOOM IN
          if( controller.screenScale < 3 ){
            controller.setScreenScale( controller.screenScale+1 );
          }
        }
        else{
          // ZOOM OUT
          if( controller.screenScale > 1 ){
            controller.setScreenScale( controller.screenScale-1 );
          }
        }
      }

      /*
      if( canvas.addEventListener){
        // IE9, Chrome, Safari, Opera
        canvas.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
      }
      // IE 6/7/8
      else canvas.attachEvent("onmousewheel", MouseWheelHandler);
      */

      canvas.onmousemove = function(ev){
        var x,y;

        if( typeof ev.offsetX === 'number' ){
          x = ev.offsetX;
          y = ev.offsetY;
        }
        else {
          x = ev.layerX;
          y = ev.layerY;
        }

        // to tile position
        var x = parseInt( x/16 , 10);
        var y = parseInt( y/16 , 10);

        /*
        if( controller.currentState === controller.STATE_SELECT_MOVE_PATH ){
          userInput.appendToCurrentMovePath(x,y);
        }*/

        controller.setCursorPosition(x,y);
      };

      canvas.onmousedown = function(ev){
        switch(ev.which){
          case 1: controller.cursorActionClick(); break;    // LEFT
          case 2: break;                                    // MIDDLE
          case 3: controller.cursorActionCancel(); break;   // RIGHT
        }
      };
    }

    // **************************************************************
    // TOUCH SUPPORT FOR TOUCH DEVICES
    if( detect.isAndroid() || detect.isTouchDevice() ){
      var appEl = document.getElementById( "cwt_canvas" );
      var hammer = new Hammer( appEl, { prevent_default: true });
      // var dragDisX = 0;
      // var dragDisY = 0;

      hammer.ontap     = function( ev ){
        var cv = appEl;
        var x = ev.position[0].x;
        var y = ev.position[0].y;

        var tileLen = controller.screenScale*TILE_LENGTH;
        var x = parseInt( x/tileLen, 10);
        var y = parseInt( y/tileLen, 10);

        // BUGFIX: HAMMER JS SEEMS TO GET THE SCREEN POSITION, NOT THE
        // POSITION ON THE CANVAS, EVEN IF IT IS BIND TO THE CANVAS
        x = x + controller.screenX;
        y = y + controller.screenY;


        // TODO ENABLE SOUND

        // INVOKE ACTION
        controller.setCursorPosition(x,y);
        controller.cursorActionClick();

        // TODO PREPARE DRAG SELECTION

        /*
        if( controller.currentState === controller.STATE_SELECT_MOVE_PATH ){
          userInput._input_touch_cDisX = x;
          userInput._input_touch_cDisY = y;
        }*/
      };

      hammer.onhold    = function(){
        controller.cursorActionCancel();
      };

      hammer.onrelease = function(ev){

      };

      hammer.ondrag    = function(ev){
        /*
         var cv = document.getElementById( client.ID_CANVAS );

         var disX = ev.distanceX - cv.offsetLeft;
         var disY = ev.distanceY - cv.offsetTop;
         userInput._input_touch_cDisTouchX = disX;
         userInput._input_touch_cDisTouchY = disY;

         var x = userInput._input_touch_cDisX+ parseInt( disX/ screen.tileSizeX, 10 );
         var y = userInput._input_touch_cDisY+ parseInt( disY/ screen.tileSizeY, 10 );

         userInput.appendToCurrentMovePath(x,y);
         */
      };

      hammer.ondragend = function(ev){
        var tileSize = TILE_LENGTH*controller.screenScale;
        var a = ev.angle;
        var d = 0;

        // GET DIRECTION
             if( a >= -135 && a < -45  ) d = model.MOVE_CODE_UP;
        else if( a >= -45  && a < 45   ) d = model.MOVE_CODE_RIGHT;
        else if( a >= 45   && a < 135  ) d = model.MOVE_CODE_DOWN;
        else if( a >= 135  || a < -135 ) d = model.MOVE_CODE_LEFT;

        // get distance
        var dis = parseInt( ev.distance/tileSize, 10 );
        if( dis === 0 ) dis = 1;

        controller.shiftScreenPosition( d, dis );

        /* ==> MOVE STATE
         var x = cDisX+ parseInt( cDisTouchX / screen.tileSizeX, 10 );
         var y = cDisY+ parseInt( cDisTouchY / screen.tileSizeY, 10 );

         userInput.invokeActionAt( x, y );

         userInput._input_touch_cDisX = -1;
         userInput._input_touch_cDisY = -1;
         userInput._input_touch_cDisTouchX = 0;
         userInput._input_touch_cDisTouchY = 0;
         */
      };

      hammer.ontransformend = function(ev){
        if( ev.scale > 1 ){
          // ZOOM IN
          if( controller.screenScale < 3 ){
            controller.setScreenScale( controller.screenScale+1 );
          }
        }
        else{
          // ZOOM OUT
          if( controller.screenScale > 1 ){
            controller.setScreenScale( controller.screenScale-1 );
          }
        }
        return false;
      };
    }
  }

});