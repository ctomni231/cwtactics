controller.setupTouchControls = function( canvas, menuEl ){
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
							if( sx > ex ) mode = "INP_LEFT";
							else mode = "INP_RIGHT";
						}
						else{
							
							// UP OR DOWN
							if( sy > ey ) mode = "INP_UP";
							else mode = "INP_DOWN";
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
							if( sx > ex ) mode = "INP_SPECIAL_2";
							else mode = "INP_SPECIAL_1";
						}
						else{
							
							// UP OR DOWN
							if( sy > ey ) mode = "INP_SPECIAL_3";
							else mode = "INP_SPECIAL_4";
						}
						
						controller.screenStateMachine.event( mode );
					}
					else controller.screenStateMachine.event("INP_CANCEL"); 
				}
				else{
					if( pinDis2<pinDis ){
						controller.screenStateMachine.event("INP_SPECIAL_6"); 
					}
					else{
						controller.screenStateMachine.event("INP_SPECIAL_5"); 
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
						controller.screenStateMachine.event("INP_ACTION"); 
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
						if( sx > ex ) mode = "INP_LEFT";
						else mode = "INP_RIGHT";
					}
					else{
						
						// UP OR DOWN
						if( sy > ey ) mode = "INP_UP";
						else mode = "INP_DOWN";
					}
					
					controller.screenStateMachine.event( mode ,1);
				}
					}
			
		}, false);
		
	});
};