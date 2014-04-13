/**
 *
 * @namespace
 */
cwt.Gameflow = {

  /**
   * @type {cwt.GameState}
   */
  activeState: null,

  /**
   * True when the game is in an active game round, else false.
   *
   * @type {boolean}
   */
  inGameRound: false,

  /**
   * @type {Array.<cwt.GameState>}
   */
  states_: {},

  /**
   * State-Machine data object to share data between
   * states.
   */
  data: {},

  /**
   *
   * @param desc
   */
  addState: function (desc) {
    if (this.DEBUG) cwt.assert(!this.states_.hasOwnProperty(desc.id));

    this.states_[desc.id] = new cwt.GameState(
      desc.init ? desc.init : cwt.emptyFunction,
      desc.exit ? desc.exit : cwt.emptyFunction,
      desc.enter ? desc.enter : cwt.emptyFunction,
      desc.update ? desc.update : cwt.emptyFunction,
      desc.render ? desc.render : cwt.emptyFunction,
      this.data
    );
  },

  /**
   * Initializes the game state machine.
   */
  initialize: function () {
    var oldTime = new Date().getTime();

    function gameLoop() {

      // acquire next frame
      requestAnimationFrame(gameLoop);

      // calculate delta
      var now = new Date().getTime();
      var delta = now - oldTime;
      oldTime = now;

      // update machine
      cwt.Gameflow.update(delta);

      /*
       if (cwt.Gameflow.inGameRound) {
       cwt.Gameround.gameTimeElapsed += delta;
       cwt.Gameround.turnTimeElapsed += delta;

       // check turn time
       if (cwt.Gameround.turnTimeLimit > 0 && cwt.Gameround.turnTimeElapsed >= cwt.Gameround.turnTimeLimit) {
       controller.commandStack_sharedInvokement("nextTurn_invoked");
       }

       // check game time
       if (cwt.Gameround.gameTimeLimit > 0 && cwt.Gameround.gameTimeElapsed >= cwt.Gameround.gameTimeLimit) {
       controller.update_endGameRound();
       }

       // ai tick
       if (!controller.commandStack_hasData()) {
       if (controller.ai_active) controller.ai_machine.event("tick");
       } else controller.commandStack_invokeNext();
       }

       controller.updateInputCoolDown(delta);
       controller.updateGamePadControls(delta);

       var usedInput = controller.input_evalNextKey();

       // if the system is in the game loop, then update the game aw2
       if (controller.inGameLoop) {

       if (controller.update_inGameRound) {
       controller.gameLoop(delta, evenFrame, usedInput);
       } else controller.screenStateMachine.event("gameHasEnded"); // game ends --> stop game loop
       }

       if (controller.screenStateMachine.state === "MOBILE") {
       controller.screenStateMachine.event("decreaseTimer", delta);
       }
       */
    }

    // enter the loop
    requestAnimationFrame(gameLoop);
  },

  /**
   *
   * @param stateId
   */
  changeState: function (stateId) {
    if (this.activeState) {

      // exit old state
      this.activeState.exit();
    }

    // enter new state
    this.setState(stateId, true);
  },

  /**
   *
   * @param stateId
   */
  setState: function (stateId, fireEvent) {
    if (this.DEBUG) cwt.assert(this.states_.hasOwnProperty(stateId));

    this.activeState = this.states_[stateId];

    if (fireEvent !== false) {
      this.activeState.enter();
    }
  },

  /**
   *
   * @param delta
   */
  update: function (delta) {
    var inp = cwt.Input.popAction();
    this.activeState.update(delta, inp);
    this.activeState.render(delta);
  }
};

/*

controller.prepareGameLoop = function(){
  savedDelta = 0;
}

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

 */