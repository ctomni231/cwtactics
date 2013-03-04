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

controller.engineAction({

  name:"loadInputDevices",
  key:"LOID",
  
  action: function(){

    var detect = new DeviceDetection( navigator.userAgent );

    // **************************************************************
    // KEYBOARD SUPPORT FOR DESKTOP DEVICES
    if( detect.isDesktop() ){
      
      document.onkeyup = function( ev ){
        if( controller.stateMachine.state === "IDLE_R" ){
          
          var code = ev.keyCode;
          switch( code ){
            case controller.INPUT_KEYBOARD_CODE_LEFT:
            case controller.INPUT_KEYBOARD_CODE_UP:
            case controller.INPUT_KEYBOARD_CODE_RIGHT:
            case controller.INPUT_KEYBOARD_CODE_DOWN:
            case controller.INPUT_KEYBOARD_CODE_BACKSPACE:
            case controller.INPUT_KEYBOARD_CODE_ENTER:
              controller.cursorActionCancel();
              return false;
          }
        }
      };
      
      //document.onkeydown = function( ev ){
      document.onkeydown = function( ev ){
        if( CLIENT_DEBUG ){
          util.logInfo("got key code",ev.keyCode);
        }

        var state = controller.stateMachine.state;
        var inMenu = ( state === "ACTION_MENU" ||
                       state === "ACTION_SUBMENU" );
        
        var code = ev.keyCode;
        switch( code ){

          case controller.INPUT_KEYBOARD_CODE_LEFT:
            controller.moveCursor( model.MOVE_CODE_LEFT, 1 );
            break;

          case controller.INPUT_KEYBOARD_CODE_UP:
            if( !inMenu ) controller.moveCursor( model.MOVE_CODE_UP, 1 );
            else controller.decreaseMenuCursor();
            
            break;

          case controller.INPUT_KEYBOARD_CODE_RIGHT:
            controller.moveCursor( model.MOVE_CODE_RIGHT, 1 );
            break;

          case controller.INPUT_KEYBOARD_CODE_DOWN:
            if( !inMenu ) controller.moveCursor( model.MOVE_CODE_DOWN, 1 );
            else controller.increaseMenuCursor();
            
            break;

          case controller.INPUT_KEYBOARD_CODE_BACKSPACE:
            controller.cursorActionCancel();
            break;

          case controller.INPUT_KEYBOARD_CODE_ENTER:
            controller.cursorActionClick();
            break;

          case controller.INPUT_KEYBOARD_CODE_M:
            controller.setScreenScale( controller.screenScale+1 );
            break;

          case controller.INPUT_KEYBOARD_CODE_N:
            controller.setScreenScale( controller.screenScale-1 );
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
    if( head.desktop ){
      var canvas = document.getElementById( "cwt_canvas" );
      var menuEl = document.getElementById( "cwt_menu" );

      var inMenu = false;
      
      menuEl.onmouseout = function(){ 
        inMenu=false; 
      };
      
      menuEl.onmouseover = function(){ 
        inMenu=true; 
      };
      
      function MouseWheelHandler(e){
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        // var delta = (e.wheelDelta || -e.detail);
        // if( delta > -10 && delta < 10 ) return;
        if( delta > 0 ){
          // ZOOM IN
          controller.setScreenScale( controller.screenScale+1 );
        }
        else{
          // ZOOM OUT
          controller.setScreenScale( controller.screenScale-1 );
        }
      }

      if( canvas.addEventListener){
        // IE9, Chrome, Safari, Opera
        canvas.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
      }
      // IE 6/7/8
      else canvas.attachEvent("onmousewheel", MouseWheelHandler);

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
        var state = controller.stateMachine.state;
        if( (state === "ACTION_MENU" || state === "ACTION_SUBMENU") && !inMenu ){
          // MENU + MOUSE OUTSIDE === CANCEL
          controller.cursorActionCancel()
        }
        else{
          switch(ev.which){
            case 1: controller.cursorActionClick(); break;    // LEFT
            case 2: break;                                    // MIDDLE
            case 3: controller.cursorActionCancel(); break;   // RIGHT
          }
        }
      };
      
      canvas.onmouseup = function(ev){
        if( controller.stateMachine.state === "IDLE_R" ){
          switch(ev.which){
            case 3: controller.cursorActionCancel(); break;   // RIGHT
          }
        }
      };
    }

    // **************************************************************
    // TOUCH SUPPORT FOR TOUCH DEVICES
    if( head.mobile ){
      var appEl = document.getElementById( "cwt_canvas" );
      var hammer = new Hammer( appEl, { prevent_default: true });
      var ios = head.browser.ios;
      var drag_up = 0;
      var drag_down = 0;

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
        if( controller.stateMachine.state === "IDLE_R" ){
          controller.cursorActionCancel();
        }
      };
      
      hammer.ondrag    = function(ev){
        var state = controller.stateMachine.state;
        if( state === "ACTION_MENU" || state === "ACTION_SUBMENU" ){
          
          var dis = ev.distanceY;
          if( dis < drag_up ){
            controller.decreaseMenuCursor();
            drag_down = drag_up;
            drag_up = drag_up-50;
          }
          else if( dis > drag_down ){
            controller.increaseMenuCursor();
            drag_up = drag_down;
            drag_down = drag_down+50;
          }
        }
      };

      hammer.ondragend = function(ev){
        
        var state = controller.stateMachine.state;
        if( state === "ACTION_MENU" || state === "ACTION_SUBMENU" ){
          drag_up = -50;
          drag_down = 50;
        }
        else{
          var tileSize = TILE_LENGTH*controller.screenScale;
          var a = ev.angle;
          var d = 0;
          
          if( !ios ){
                 if( a >= -135 && a < -45  ) d = model.MOVE_CODE_UP;
            else if( a >= -45  && a < 45   ) d = model.MOVE_CODE_RIGHT;
            else if( a >= 45   && a < 135  ) d = model.MOVE_CODE_DOWN;
            else if( a >= 135  || a < -135 ) d = model.MOVE_CODE_LEFT;
          }
          else{
                 if( a >= -135 && a < -45  ) d = model.MOVE_CODE_DOWN;
            else if( a >= -45  && a < 45   ) d = model.MOVE_CODE_LEFT;
            else if( a >= 45   && a < 135  ) d = model.MOVE_CODE_UP;
            else if( a >= 135  || a < -135 ) d = model.MOVE_CODE_RIGHT;
          }
          
          // get distance
          var dis = parseInt( ev.distance/tileSize, 10 );
          if( dis === 0 ) dis = 1;
  
          controller.shiftScreenPosition( d, dis );
        }

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
          controller.setScreenScale( controller.screenScale+1 );
        }
        else{
          // ZOOM OUT
          controller.setScreenScale( controller.screenScale-1 );
        }
        return false;
      };
    }
  }

});