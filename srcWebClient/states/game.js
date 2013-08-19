util.scoped(function(){
  
  /** @private */
  function loadMapCb( obj ){
    controller.startGameRound( obj.value );
    
    // UPDATE SCREEN DATA
    controller.setCursorPosition(0,0);
    view.resizeCanvas();
    view.updateMapImages();
    view.completeRedraw();
    
    // UPDATE UNIT STATS
    for( var i=0,e=model.units.length; i<e; i++ ){
      if( model.units[i].owner !== constants.INACTIVE_ID ) controller.updateUnitStatus( i );
    }
    
    controller.playSoundForPlayer( model.turnOwner );
    controller.renderPlayerInfo();
    
    // INIT LOOP
    setupAnimationFrame();
  }
  
  function setupAnimationFrame(){
    if( constants.DEBUG ) util.log("setup animation frame");
    
    // PREPARE LOOP
    controller.prepareGameLoop();
    
    var oldTime = new Date().getTime();
    function looper(){
      if( !controller.inGameRound ){
        controller.screenStateMachine.event("gameHasEnded");
        return;
      }
      
      requestAnimationFrame( looper );
      
      var now = new Date().getTime();
      var delta = now - oldTime;
      oldTime = now;
      
      controller.gameLoop( delta );
    }
    
    // ENTER LOOP
    requestAnimationFrame( looper );
  }
  
  // -----------------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.GAMEROUND = Object.create(controller.stateParent);
  
	controller.screenStateMachine.structure.GAMEROUND.section = "cwt_game_screen";
	
  controller.screenStateMachine.structure.GAMEROUND.enterState = function(){
    controller.storage.get( this.data.mapToLoad, loadMapCb );
  };
  
  controller.screenStateMachine.structure.GAMEROUND.gameHasEnded = function(){
    return "MAIN";
  };
  
  
  
  // ++++++++++++ INPUT MOVE ++++++++++++
  
  controller.screenStateMachine.structure.GAMEROUND.LEFT = function( ev, distance ){
    controller.hideAttackRangeInfo();
    
    // IN TARGET TILE SELECTION MODE ?
    var state = controller.stateMachine.state;
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, true, controller.setCursorPosition
      );
      return this.BREAK_TRANSITION;
    }
    
    if( !distance ) distance = 1;
    
    if( distance === 1 ) controller.moveCursor( model.MOVE_CODE_LEFT, distance );
    else controller.shiftScreenPosition( model.MOVE_CODE_LEFT, distance );
    
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.RIGHT = function( ev, distance ){
    controller.hideAttackRangeInfo();
    
    // IN TARGET TILE SELECTION MODE ?
    var state = controller.stateMachine.state;
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, false, controller.setCursorPosition
      );
      return this.BREAK_TRANSITION;
    }
    
    if( !distance ) distance = 1;
    
    if( distance === 1 ) controller.moveCursor( model.MOVE_CODE_RIGHT, distance );
    else controller.shiftScreenPosition( model.MOVE_CODE_RIGHT, distance );
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.UP = function( ev, distance ){
    controller.hideAttackRangeInfo();
    
    var state = controller.stateMachine.state;
    
    // IN TARGET TILE SELECTION MODE ?
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, true, controller.setCursorPosition
      );
      return this.BREAK_TRANSITION;
    }
    
    var inMenu = ( state === "ACTION_MENU" || state === "ACTION_SUBMENU" );
    
    if( !distance ) distance = 1;
    
    if( !inMenu ){
      if( distance === 1 ) controller.moveCursor( model.MOVE_CODE_UP, distance );
      else controller.shiftScreenPosition( model.MOVE_CODE_UP, distance );
    }
    else controller.decreaseMenuCursor();
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.DOWN = function( ev, distance ){
    controller.hideAttackRangeInfo();
    
    var state = controller.stateMachine.state;
    
    // IN TARGET TILE SELECTION MODE ?
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, false, controller.setCursorPosition
      );
      return this.BREAK_TRANSITION;
    }
    
    var inMenu = ( state === "ACTION_MENU" || state === "ACTION_SUBMENU" );
    
    if( !distance ) distance = 1;
    
    if( !inMenu ){ 
      if( distance === 1 ) controller.moveCursor( model.MOVE_CODE_DOWN, distance );
      else controller.shiftScreenPosition( model.MOVE_CODE_DOWN, distance );
    }
    else controller.increaseMenuCursor();
    return this.BREAK_TRANSITION;
  };
  
  
  // ++++++++++++ INPUT ACTIONS ++++++++++++
  
  controller.screenStateMachine.structure.GAMEROUND.ACTION = function( ev,x,y ){
    controller.hideAttackRangeInfo();
    
    if( typeof x === "number" ) controller.setCursorPosition(x,y);
    controller.cursorActionClick();
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.HOVER = function( ev,x,y ){
    controller.setCursorPosition(x,y);
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.CANCEL = function( ev,x,y ){
    controller.hideAttackRangeInfo();
    
    if( typeof x === "number" ) controller.setCursorPosition(x,y);
    controller.cursorActionCancel();
    return this.BREAK_TRANSITION;
  };
  
  
  
  // ++++++++++++ INPUT SPECIAL ++++++++++++
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_1 = function(){
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_2 = function(){
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_3 = function(){
    if( !controller.attackRangeVisible ){
      controller.showAttackRangeInfo();
    }
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_4 = function(){
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_5 = function(){
    controller.setScreenScale( controller.screenScale+1 );
    return this.BREAK_TRANSITION;
  };
  
  controller.screenStateMachine.structure.GAMEROUND.SPECIAL_6 = function(){
    controller.setScreenScale( controller.screenScale-1 );
    return this.BREAK_TRANSITION;
  };
  
});