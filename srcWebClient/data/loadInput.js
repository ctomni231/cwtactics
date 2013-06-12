/**
 * 
 */
controller.loadInputDevices = util.singleLazyCall(function( err, baton ){
  
  var INPUT_KEYBOARD_CODE_LEFT  = 37;
  var INPUT_KEYBOARD_CODE_UP    = 38;
  var INPUT_KEYBOARD_CODE_RIGHT = 39;
  var INPUT_KEYBOARD_CODE_DOWN  = 40;
  
  var INPUT_KEYBOARD_CODE_BACKSPACE = 8;
  var INPUT_KEYBOARD_CODE_ENTER = 13;
  
  var INPUT_KEYBOARD_CODE_M = 77;
  var INPUT_KEYBOARD_CODE_N = 78;
  
  var INPUT_KEYBOARD_CODE_1 = 49;
  var INPUT_KEYBOARD_CODE_2 = 50;
  var INPUT_KEYBOARD_CODE_3 = 51;
  var INPUT_KEYBOARD_CODE_4 = 52;
  var INPUT_KEYBOARD_CODE_5 = 53;
  var INPUT_KEYBOARD_CODE_6 = 54;
  
  var INPUT_KEYBOARD_CODE_TAB = 9;
  
  baton.take(); 
  
  if( DEBUG ) util.log("loading input devices");
  
  var canvas = document.getElementById( ID_ELMT_GAME_CANVAS );
  var menuEl = document.getElementById( ID_ELMT_GAME_MENU );
  
  // ------------------------------------------ KEYBOARD CONTROLS -------------------------------------------
  // --------------------------------------------------------------------------------------------------------
  
  if( head.desktop ){
    
    if( DEBUG ) util.log("initializing keyboard support");
    
    // KEY DOWN
    document.onkeydown = function( ev ){
      var code = ev.keyCode;
      if( event.target.id === "cwt_options_mapIn" ){
        switch( code ){            
          case INPUT_KEYBOARD_CODE_UP:
            controller.screenStateMachine.event("UP",1);
            return false;
            
          case INPUT_KEYBOARD_CODE_DOWN:
            controller.screenStateMachine.event("DOWN",1);
            return false;
        }
        return true;
      } 
      
      switch( code ){
          
        case INPUT_KEYBOARD_CODE_1:
          controller.screenStateMachine.event("SPECIAL_1");
          return false;
          
        case INPUT_KEYBOARD_CODE_2:
          controller.screenStateMachine.event("SPECIAL_2");
          return false;
          
        case INPUT_KEYBOARD_CODE_3:
          controller.screenStateMachine.event("SPECIAL_3");
          return false;
          
        case INPUT_KEYBOARD_CODE_4:
          controller.screenStateMachine.event("SPECIAL_4");
          return false;
          
        case INPUT_KEYBOARD_CODE_5:
          controller.screenStateMachine.event("SPECIAL_5");
          return false;
          
        case INPUT_KEYBOARD_CODE_6:
          controller.screenStateMachine.event("SPECIAL_6");
          return false;
          
        case INPUT_KEYBOARD_CODE_LEFT:
          controller.screenStateMachine.event("LEFT",1);
          return false;
          
        case INPUT_KEYBOARD_CODE_UP:
          controller.screenStateMachine.event("UP",1);
          return false;
          
        case INPUT_KEYBOARD_CODE_RIGHT:
          controller.screenStateMachine.event("RIGHT",1);
          return false;
          
        case INPUT_KEYBOARD_CODE_DOWN:
          controller.screenStateMachine.event("DOWN",1);
          return false;
          
        case INPUT_KEYBOARD_CODE_BACKSPACE:
          controller.screenStateMachine.event("CANCEL");
          return false;
          
        case INPUT_KEYBOARD_CODE_ENTER:
          controller.screenStateMachine.event("ACTION");
          return false;
      }
      
      return true;
    };
    
    // -------------------------------------------- MOUSE CONTROLS --------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    
    if( DEBUG ) util.log("initializing mouse support");
    
    // MENU HINTS
    var mouseInMenu = false;
    menuEl.onmouseout = function(){ mouseInMenu=false; };
    menuEl.onmouseover = function(){ mouseInMenu=true; };
    
    function MouseWheelHandler(e){
      if( controller.inputCoolDown > 0 ) return false;
      if( controller.menuVisible ) return false;
      
      // if( inClick ) return;
      
      var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      if( delta > 0 ) controller.screenStateMachine.event("SPECIAL_5");
      else            controller.screenStateMachine.event("SPECIAL_6");
      
      controller.inputCoolDown = 1000;
    }
    
    if( document.addEventListener){
      
      // IE9, Chrome, Safari, Opera
      document.addEventListener("mousewheel", MouseWheelHandler, false);
      
      // Firefox
      document.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }
    
    var len = TILE_LENGTH;
    var msx = 0;
    var msy = 0;
    var menusy = 0;
    document.addEventListener("mousemove", function(ev){
      //if( controller.inputCoolDown > 0 ) return false;
      
      var id = ev.target.id;
      if( id !== "cwt_canvas" && !controller.menuVisible ) return;
      
      var x,y;
      ev = ev || window.event;
      //if( inClick ) return;
      
      if( controller.menuVisible ){
        x = ev.pageX;
        y = ev.pageY;
        
        if( menusy !== -1 ){      
          if( y <= menusy-16 ){
            controller.screenStateMachine.event("UP");
            menusy = y;
          }
          else if( y >= menusy+16 ){
            controller.screenStateMachine.event("DOWN");
            menusy = y;
          }
            }
        else menusy = y;
      }
      else{
        
        if( typeof ev.offsetX === 'number' ){
          x = ev.offsetX;
          y = ev.offsetY;
        }
        else {
          x = ev.layerX;
          y = ev.layerY;
        }
        
        // TO TILE POSITION
        x = parseInt( x/len , 10);
        y = parseInt( y/len , 10);
        
        controller.screenStateMachine.event("HOVER",x,y);
      }
    });
    
    //var inClick = false;
    document.onmousedown = function(ev){      
      ev = ev || window.event;
      //inClick = true;
      
      if( typeof ev.offsetX === 'number' ){
        msx = ev.offsetX;
        msy = ev.offsetY;
      }
      else {
        msx = ev.layerX;
        msy = ev.layerY;
      }
    };
    
    document.onmouseup = function(ev){    
      
      ev = ev || window.event;
      //inClick = false;
      
      var msex;
      var msey;
      if( typeof ev.offsetX === 'number' ){
        msex = ev.offsetX;
        msey = ev.offsetY;
      }
      else {
        msex = ev.layerX;
        msey = ev.layerY;
      }
      
      var dex = Math.abs( msx-msex );
      var dey = Math.abs( msy-msey );
      menusy = -1;
      
      switch(ev.which){
          
        case 1: controller.screenStateMachine.event("ACTION"); break; // LEFT
        case 2: break;                                                // MIDDLE
          
          // RIGHT
        case 3: 
          /*
          if( dex > 32 || dey > 32 ){
            // EXTRACT DIRECTION
            var mode;
            if( dex > dey ){
              
              // LEFT OR RIGHT
              if( msx > msex ) mode = "SPECIAL_2";
              else mode = "SPECIAL_1";
            }
            else{
              
              // UP OR DOWN
              if( msy > msey ) mode = "SPECIAL_3";
              else mode = "SPECIAL_4";
            }
            
            controller.screenStateMachine.event( mode );
          }
          else 
          */
          
          controller.screenStateMachine.event("CANCEL"); 
          break; 
      }
    };
  }
  
  // -------------------------------------------- TOUCH CONTROLS --------------------------------------------
  // --------------------------------------------------------------------------------------------------------
  
  if( head.mobile ){
    util.scoped(function(){
      
      // SELECTED POSITIONS ( FIRST FINGER )
      var sx,sy;
      var ex,ey;
      
      // SELECTED POSITIONS ( SECOND FINGER )
      var s2x,s2y;
      var e2x,e2y;
      
      // START TIMESTAMP
      var st;
      
      // PINCH VARS
      var pinDis,pinDis2;
      
      // DRAG VARS
      var dragDiff=0;
      var isDrag = false;
      
      // TOUCH STARTS
      document.addEventListener('touchstart', function(event) {
        if( event.target.id !== "cwt_options_mapIn" ) event.preventDefault();
        
        // SAVE POSITION AND CLEAR OLD DATA
        sx = event.touches[0].screenX;
        sy = event.touches[0].screenY;
        ex = sx;
        ey = sy;        
        isDrag = false;
        
        // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
        if( event.touches.length === 2 ){
          
          // SAVE POSITION AND CLEAR OLD DATA
          s2x = event.touches[1].screenX;
          s2y = event.touches[1].screenY;
          e2x = s2x;
          e2y = s2y;
          
          // REMEMBER DISTANCE BETWEEN FIRST AND SECOND FINGER
          var dx = Math.abs(sx-s2x);
          var dy = Math.abs(sy-s2y);
          pinDis = Math.sqrt(dx*dx+dy*dy)
          
        } 
        else s2x = -1;
        
        // REMEMBER TIME STAMP
        st = event.timeStamp;
      }, false);
      
      // TOUCH MOVES
      document.addEventListener('touchmove', function(event) {
        if( event.target.id !== "cwt_options_mapIn" ) event.preventDefault();
        
        // SAVE POSITION 
        ex = event.touches[0].screenX;
        ey = event.touches[0].screenY;
        
        // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
        if( event.touches.length === 2 ){
          
          // SAVE POSITION 
          e2x = event.touches[1].screenX;
          e2y = event.touches[1].screenY;
          
          // REMEMBER NEW DISTANCE BETWEEN FIRST AND SECOND FINGER
          // TO BE ABLE TO CALCULATION A PINCH MOVE IF TOUCH END EVENT
          // WILL BE TRIGGERED
          var dx = Math.abs(ex-e2x);
          var dy = Math.abs(ey-e2y);
          pinDis2 = Math.sqrt(dx*dx+dy*dy)
        } 
        else s2x = -1;
        
        // REMEMBER DISTANCE BETWEEN START POSITION AND CURRENT POSITION
        var dx = Math.abs(sx-ex);
        var dy = Math.abs(sy-ey);
        var d = Math.sqrt(dx*dx+dy*dy);
        
        var timeDiff = event.timeStamp - st;
        if( d > 16 ){
          
          // IT IS A DRAG MOVE WHEN THE DISTANCE IS GROWING AND A GIVEN TIME IS UP
          if( timeDiff > 300 ){
            
            // REMEMBER NOW THAT YOUR ARE IN A DRAG SESSION
            isDrag = true;
            
            // DRAG WOULD BE FIRED VERY OFTEN IN A SECOND
            // ONLY FIRE WHEN THE A GIVEN TIME IS UP SINCE START
            // OR THE LAST DRAG EVENT
            if( dragDiff > 75 ){
              
              // EXTRACT DIRECTION
              var mode;
              if( dx > dy ){
                
                // LEFT OR RIGHT
                if( sx > ex ) mode = "LEFT";
                else mode = "RIGHT";
              }
              else{
                
                // UP OR DOWN
                if( sy > ey ) mode = "UP";
                else mode = "DOWN";
              }
              
              // RESET META DATA AND SET START POSITION TO THE 
              // CURRENT POSITION TO EXTRACT CORRECT DIRECTION IN THE 
              // NEXT DRAG EVENT
              dragDiff = 0;
              sx = ex;
              sy = ey;
              
              controller.screenStateMachine.event( mode ,1);
            }
            else dragDiff += timeDiff;
          }
        }
      }, false);
      
      // TOUCH END
      document.addEventListener('touchend', function(event) {        
        if( event.target.id !== "cwt_options_mapIn" ) event.preventDefault();
        
        if( controller.inputCoolDown > 0 ) return;
        
        // CALCULATE DISTANCE AND TIME GAP BETWEEN START AND END EVENT
        var dx = Math.abs(sx-ex);
        var dy = Math.abs(sy-ey);
        var d = Math.sqrt(dx*dx+dy*dy);
        var timeDiff = event.timeStamp - st;
        
        // IS IT A TWO PINCH GESTURE?
        if( s2x !== -1 ){
          
          var pinDis3 = Math.abs( pinDis2 - pinDis );
          if( pinDis3 <= 32 ){
            
            if( dx > 48 || dy > 48 ){
              
              // EXTRACT DIRECTION
              var mode;
              if( dx > dy ){
                
                // LEFT OR RIGHT
                if( sx > ex ) mode = "SPECIAL_2";
                else mode = "SPECIAL_1";
              }
              else{
                
                // UP OR DOWN
                if( sy > ey ) mode = "SPECIAL_3";
                else mode = "SPECIAL_4";
              }
              
              controller.screenStateMachine.event( mode );
            }
            else controller.screenStateMachine.event("CANCEL"); 
          }
          else{
            if( pinDis2<pinDis ){
              controller.screenStateMachine.event("SPECIAL_6"); 
            }
            else{
              controller.screenStateMachine.event("SPECIAL_5"); 
            }
          }
          
          // PLACE A COOLDOWN TO PREVENT ANOTHER COMMAND AFTER
          // THE SPECIAL COMMAND
          // THIS SEEMS TO HAPPEN WHEN YOU RELEASE BOTH FINGERS 
          // NOT EXACT AT THE SAME TIME
          controller.inputCoolDown = 500;
        }
        else{
          
          // IF DISTANCE IS 16 OR LOWER THEN THE FINGER HASN'T REALLY
          // MOVED THEN IT'S A TAP
          if( d <= 16 ){
            
            // SHORT TIME GAP MEAN TAP
            if( timeDiff <= 500 ){
              controller.screenStateMachine.event("ACTION"); 
              //}
              // ELSE CANCEL IF YOU AREN'T IN A DRAG SESSION
              //else if( !isDrag ){
              //controller.screenStateMachine.event("CANCEL"); 
            }
          }
          // A VERY SHORT AND FAST DRAG IS A SWIPE GESTURE
          else if( timeDiff <= 300 ) {
            
            // EXTRACT DIRECTION
            var mode;
            if( dx > dy ){
              
              // LEFT OR RIGHT
              if( sx > ex ) mode = "LEFT";
              else mode = "RIGHT";
            }
            else{
              
              // UP OR DOWN
              if( sy > ey ) mode = "UP";
              else mode = "DOWN";
            }
            
            controller.screenStateMachine.event( mode ,1);
          }
            }
        
      }, false);
      
    });
  }
  
  baton.pass(false);   
});