util.scoped(function(){
	controller.setupKeyboardControls = function( canvas, menuEl ){
		if( DEBUG ) util.log("initializing keyboard support");

		document.onkeydown = function( ev ){

      // in key mapping
      if( controller.activeMapping !== null && controller.activeMapping === controller.KEY_MAPPINGS.KEYBOARD ){
        controller.screenStateMachine.event("INPUT_SET",ev.keyCode);
      }
      else{
        var keymap = controller.keyMaps.KEYBOARD;
        switch( ev.keyCode ){

          // +++++++++++++++++++++ d-pad +++++++++++++++++++++++

          case keymap.LEFT:
            controller.screenStateMachine.event("INP_LEFT",1);
            return false;

          case keymap.UP:
            controller.screenStateMachine.event("INP_UP",1);
            return false;

          case keymap.RIGHT:
            controller.screenStateMachine.event("INP_RIGHT",1);
            return false;

          case keymap.DOWN:
            controller.screenStateMachine.event("INP_DOWN",1);
            return false;

          // +++++++++++++++++++++ actions +++++++++++++++++++++

          case keymap.CANCEL:
            controller.screenStateMachine.event("INP_CANCEL");
            return false;

          case keymap.ACTION:
            controller.screenStateMachine.event("INP_ACTION");
            return false;
        }
      }
			
			return false;
		};
		
	};
});
