util.scoped(function(){

  var noInit = false;
  var miniMapOpen = false;

  // -----------------------------------------------------------------------------------------------

  controller.screenStateMachine.structure.GAMEROUND = Object.create(controller.stateParent);

  controller.screenStateMachine.structure.GAMEROUND.section = "cwt_game_screen";
  
  controller.screenStateMachine.structure.GAMEROUND.enterState = function(){
    if( noInit !== true ){

      controller.audio_stopMusic();

      // start
      controller.setCursorPosition(0,0);
      controller.update_startGameRound();

      // update unit stats
      for( var i=0,e=model.unit_data.length; i<e; i++ ){
        if( model.unit_data[i].owner !== INACTIVE_ID ) controller.updateUnitStatus( i );
      }

      // prepare screen and screen data
      view.resizeCanvas();
      view.updateMapImages();
      view.redraw_markAll();

      // go into max zoom ( TODO: grab it from settings later on )
      controller.setScreenScale(2);

      // allow game loop
      controller.inGameLoop = true;
      controller.prepareGameLoop();
    }

    noInit = false;
    miniMapOpen = false;
  };

  controller.screenStateMachine.structure.GAMEROUND.gameHasEnded = function(){
    controller.inGameLoop = false;
    return "MAIN";
  };

  // ++++++++++++ INPUT MOVE ++++++++++++

  controller.screenStateMachine.structure.GAMEROUND.LEFT = function( ev, distance ){

    // IN TARGET TILE SELECTION MODE ?
    var state = controller.stateMachine.state;
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, true, controller.setCursorPosition
      );
      return this.breakTransition();
    }

    if( !distance ) distance = 1;

    if( distance === 1 ) controller.moveCursor( model.move_MOVE_CODES.LEFT, distance );
    else controller.shiftScreenPosition( model.move_MOVE_CODES.LEFT, distance );

    return this.breakTransition();
  };

  controller.screenStateMachine.structure.GAMEROUND.RIGHT = function( ev, distance ){

    // IN TARGET TILE SELECTION MODE ?
    var state = controller.stateMachine.state;
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, false, controller.setCursorPosition
      );
      return this.breakTransition();
    }

    if( !distance ) distance = 1;

    if( distance === 1 ) controller.moveCursor( model.move_MOVE_CODES.RIGHT, distance );
    else controller.shiftScreenPosition( model.move_MOVE_CODES.RIGHT, distance );
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.GAMEROUND.UP = function( ev, distance ){
    var state = controller.stateMachine.state;

    // IN TARGET TILE SELECTION MODE ?
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, true, controller.setCursorPosition
      );
      return this.breakTransition();
    }

    var inMenu = ( state === "ACTION_MENU" || state === "ACTION_SUBMENU" );

    if( !distance ) distance = 1;

    if( !inMenu ){
      if( distance === 1 ) controller.moveCursor( model.move_MOVE_CODES.UP, distance );
      else controller.shiftScreenPosition( model.move_MOVE_CODES.UP, distance );
    }
    else controller.decreaseMenuCursor();
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.GAMEROUND.DOWN = function( ev, distance ){
    var state = controller.stateMachine.state;

    // IN TARGET TILE SELECTION MODE ?
    if( state === "ACTION_SELECT_TARGET_A" || state === "ACTION_SELECT_TARGET_B" ){
      controller.stateMachine.data.selection.nextValidPosition(
        controller.mapCursorX, controller.mapCursorY,
        0, false, controller.setCursorPosition
      );
      return this.breakTransition();
    }

    var inMenu = ( state === "ACTION_MENU" || state === "ACTION_SUBMENU" );

    if( !distance ) distance = 1;

    if( !inMenu ){
      if( distance === 1 ) controller.moveCursor( model.move_MOVE_CODES.DOWN, distance );
      else controller.shiftScreenPosition( model.move_MOVE_CODES.DOWN, distance );
    }
    else controller.increaseMenuCursor();
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.GAMEROUND.SHIFT_DOWN = function( ev, distance ){
    controller.shiftScreenPosition( model.move_MOVE_CODES.DOWN, distance );
    controller.moveCursor(   model.move_MOVE_CODES.DOWN, distance );
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.GAMEROUND.SHIFT_UP = function( ev, distance ){
    controller.shiftScreenPosition( model.move_MOVE_CODES.UP, distance );
    controller.moveCursor(   model.move_MOVE_CODES.UP, distance );
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.GAMEROUND.SHIFT_LEFT = function( ev, distance ){
    controller.shiftScreenPosition( model.move_MOVE_CODES.LEFT, distance );
    controller.moveCursor(   model.move_MOVE_CODES.LEFT, distance );
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.GAMEROUND.SHIFT_RIGHT = function( ev, distance ){
    controller.shiftScreenPosition( model.move_MOVE_CODES.RIGHT, distance );
    controller.moveCursor(   model.move_MOVE_CODES.RIGHT, distance );
    return this.breakTransition();
  };

  // ++++++++++++ INPUT ACTIONS ++++++++++++

  controller.screenStateMachine.structure.GAMEROUND.ACTION = function( ev,x,y ){
    var state = controller.stateMachine.state;
    if( state === "IDLE" ){
      if( controller.attackRangeVisible ){
        controller.hideAttackRangeInfo();
        return this.breakTransition();
      }
    }

    if( typeof x === "number" ){
      controller.setCursorPosition(x,y);
    }

    controller.cursorActionClick();
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.GAMEROUND.HOVER = function( ev,x,y ){
    controller.setCursorPosition(x,y,false,true);
    return this.breakTransition();
  };

  controller.screenStateMachine.structure.GAMEROUND.CANCEL = function( ev,x,y ){
    if( !controller.menuVisible ){
      var mx,my;
      if( arguments.length === 1 ){
         mx = controller.mapCursorX;
         my = controller.mapCursorY;
      }else{
         mx = x;
         my = y;
      }

      // if minimap is open, then close it
      if( miniMapOpen ){
        controller.minimap_hideIngameMinimap();
        miniMapOpen = false;  
        return this.breakTransition();
      }

      var prop = model.property_posMap[mx][my];
      var unit = model.unit_posData[mx][my];
      
      // if minimap is not open and the click happens on an empty tile, then show it
      if( controller.stateMachine.state === "IDLE" && (
         !model.fog_turnOwnerData[mx][my] || ( !prop && !unit ) ) 
        ){
        
        controller.minimap_showIngameMinimap();
        miniMapOpen = true;   
        return this.breakTransition();
      }
    }

    var state = controller.stateMachine.state;
    if( state === "IDLE" ){
      if( !controller.attackRangeVisible ){
        var unit = model.unit_posData[controller.mapCursorX][controller.mapCursorY];
        if( unit ){
          controller.showAttackRangeInfo();
          return this.breakTransition();
        }
      }
      else {
        controller.hideAttackRangeInfo();
        return this.breakTransition();
      }
    }

    if( typeof x === "number" ) controller.setCursorPosition(x,y);

    controller.cursorActionCancel();
    return this.breakTransition();
  };

  // Must be called by controller.screenStateMachine.event("toOptions_",true);
  //
  controller.screenStateMachine.structure.GAMEROUND.toOptions_ = function(){
    assert( arguments.length === 2 && arguments[1] === true );
    noInit = true;
    return "OPTIONS";
  };

});
