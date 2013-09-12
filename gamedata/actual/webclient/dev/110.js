util.scoped(function(){
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
	
	controller.setupKeyboardControls = function( canvas, menuEl ){
		if( constants.DEBUG ) util.log("initializing keyboard support");
		
		// KEY DOWN
		document.onkeydown = function( ev ){
			var code = ev.keyCode;
			if( event.target.id === "cwt_options_mapIn" ){
				switch( code ){            
					case INPUT_KEYBOARD_CODE_UP:
						controller.screenStateMachine.event("INP_UP",1);
						return false;
						
					case INPUT_KEYBOARD_CODE_DOWN:
						controller.screenStateMachine.event("INP_DOWN",1);
						return false;
				}
				return true;
			} 
			
			switch( code ){
					
				case INPUT_KEYBOARD_CODE_1:
					controller.screenStateMachine.event("INP_SPECIAL_1");
					return false;
					
				case INPUT_KEYBOARD_CODE_2:
					controller.screenStateMachine.event("INP_SPECIAL_2");
					return false;
					
				case INPUT_KEYBOARD_CODE_3:
					controller.screenStateMachine.event("INP_SPECIAL_3");
					return false;
					
				case INPUT_KEYBOARD_CODE_4:
					controller.screenStateMachine.event("INP_SPECIAL_4");
					return false;
					
				case INPUT_KEYBOARD_CODE_5:
					controller.screenStateMachine.event("INP_SPECIAL_5");
					return false;
					
				case INPUT_KEYBOARD_CODE_6:
					controller.screenStateMachine.event("INP_SPECIAL_6");
					return false;
					
				case INPUT_KEYBOARD_CODE_LEFT:
					controller.screenStateMachine.event("INP_LEFT",1);
					return false;
					
				case INPUT_KEYBOARD_CODE_UP:
					controller.screenStateMachine.event("INP_UP",1);
					return false;
					
				case INPUT_KEYBOARD_CODE_RIGHT:
					controller.screenStateMachine.event("INP_RIGHT",1);
					return false;
					
				case INPUT_KEYBOARD_CODE_DOWN:
					controller.screenStateMachine.event("INP_DOWN",1);
					return false;
					
				case INPUT_KEYBOARD_CODE_BACKSPACE:
					controller.screenStateMachine.event("INP_CANCEL");
					return false;
					
				case INPUT_KEYBOARD_CODE_ENTER:
					controller.screenStateMachine.event("INP_ACTION");
					return false;
			}
			
			return true;
		};
		
	};
});