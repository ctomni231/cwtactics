util.scoped(function(){
  
  var activeHock = null;
  var hasHocks = false;
  var savedDelta = 0;
  
  function tryToPopNextHook(){
    
    // CHECK HOOKS
    if( !view.hooksBuffer.isEmpty() ){
      hasHocks = true;
      var data = view.hooksBuffer.pop();
      var key = data[data.length-1];
      activeHock = view.animationHooks[ key ];
      activeHock.prepare.apply( activeHock, data );
    }
    else hasHocks = false;
  }
  
  /**
   * 
   */
  controller.prepareGameLoop = function(){
    savedDelta = 0;
  }
  
  /**
   * 
   * @param {type} delta
   * @returns {undefined}
   */
  controller.gameLoop = function( delta, updateLogic, inputUsed ){

    savedDelta += delta; // SAVE DELTAS FOR UPDATE LOGIC ( --> TURN TIMER AND SO ON )
        
    var inMove = (controller.moveScreenX !== 0 || controller.moveScreenY !== 0);
    
    // IF SCREEN IS IN MOVEMENT THEN UPDATE THE MAP SHIFT
    if( inMove ) controller.solveMapShift();
    // ELSE UPDATE THE LOGIC
    else{
      
      // IF MESSAGE PANEL IS VISIBLE THEN BREAK PROCESS UNTIL
      // IT CAN BE HIDDEN
      if( view.hasInfoMessage() ){
        view.updateMessagePanelTime(delta);
      }
      else{
        if( updateLogic ){
          
          // only update game state when no hooks are in the hooks cache
          if( !hasHocks ){
            if( !inputUsed ){
              
              // UPDATE LOGIC
              controller.update_tickFrame( savedDelta );
              savedDelta = 0;
                
              // CHECK HOOKS
              tryToPopNextHook();
            }
          }
          // ELSE EVALUATE ACTIVE HOCK
          else{
            activeHock.update(delta);
            if( activeHock.isDone() ) tryToPopNextHook();
          }
        }
      }
      
      // UPDATE SPRITE ANIMATION
      view.updateSpriteAnimations( delta );
    }
    
    // RENDER SCREEN
    if( !updateLogic ){
      if( view.redraw_dataChanges > 0 ) view.renderMap( controller.screenScale );
    
      // RENDER ACTIVE HOCK AND POP NEXT ONE WHEN DONE
      if( hasHocks ){
        activeHock.render();
      }
      else{
        
        // UPDATE SELECTION CURSOR
        if( controller.stateMachine.state === "ACTION_SELECT_TILE" ){
          
          var r = view.selectionRange;
          var x = controller.mapCursorX;
          var y = controller.mapCursorY;
          var lX;
          var hX;
          var lY = y-r;
          var hY = y+r;
          if( lY < 0 ) lY = 0;
          if( hY >= model.map_height ) hY = model.map_height-1;
          for( ; lY<=hY; lY++ ){
            
            var disY = Math.abs( lY-y );
            lX = x-r+disY;
            hX = x+r-disY;
            if( lX < 0 ) lX = 0;
            if( hX >= model.map_width ) hX = model.map_width-1;
            for( ; lX<=hX; lX++ ){
              
              view.redraw_markPos(lX,lY);
            }
          }
        }
      }
      
    }
    
  };
  
  controller.inGameLoop = false;

  controller.inAnimationHookPhase = function(){
    return hasHocks;
  };
  
});
