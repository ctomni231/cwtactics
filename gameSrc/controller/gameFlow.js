/**
 *
 * @namespace
 */
cwt.Gameflow = {

  /**
   * @type {String}
   */
  activeStateId: null,

  /**
   * @type {cwt.GameState}
   */
  activeState: null,

  /**
   * @type {Array.<cwt.GameState>}
   * @private
   */
  states_: {},

  /**
   * State-Machine data object to share data between
   * states.
   */
  globalData: {},

  /**
   *
   * @param desc
   */
  addState: function (desc) {
    if (cwt.DEBUG) cwt.assert(!this.states_.hasOwnProperty(desc.id));

    var state = new cwt.GameState(
      desc.enter ? desc.enter : cwt.emptyFunction,
      desc.exit ? desc.exit : cwt.emptyFunction,
      desc.update ? desc.update : cwt.emptyFunction,
      desc.render ? desc.render : cwt.emptyFunction,
      {
        globalData: this.globalData
      }
    );

    if (desc.init) {
      desc.init.call(state.data, state.data.globalData);
    }

    this.states_[desc.id] = state;
  },

  /**
   *
   * @param desc
   */
  addInGameState: function (desc) {
    cwt.Gameflow.addState({

      id: desc.id,

      init: function () {
        this.inputMove = function (x, y) {
          if (desc.inputMove) {
            desc.inputMove.call(this, this.globalData, x, y);
          } else {
            cwt.Cursor.setPosition(
              cwt.Screen.convertToTilePos(x),
              cwt.Screen.convertToTilePos(y),
              true
            );
          }
        };

        if (desc.init) {
          desc.init.call(this, this.globalData);
        }
      },

      enter: function () {
        if (desc.enter) {
          desc.enter.call(this, this.globalData);
        }
      },

      exit: function () {
        if (desc.exit) {
          desc.exit.call(this, this.globalData);
        }
      },

      update: function (delta, input) {
        if (input) {
          switch (input.key) {

            case cwt.Input.TYPE_LEFT:
              if (desc.LEFT) {
                desc.LEFT.call(this, this.globalData, delta);
              } else {
                cwt.Cursor.move(cwt.Move.MOVE_CODES_LEFT);
              }
              break;

            case cwt.Input.TYPE_UP:
              if (desc.UP) {
                desc.UP.call(this, this.globalData, delta);
              } else {
                cwt.Cursor.move(cwt.Move.MOVE_CODES_UP);
              }
              break;

            case cwt.Input.TYPE_RIGHT:
              if (desc.RIGHT) {
                desc.RIGHT.call(this, this.globalData, delta);
              } else {
                cwt.Cursor.move(cwt.Move.MOVE_CODES_RIGHT);
              }
              break;

            case cwt.Input.TYPE_DOWN:
              if (desc.DOWN) {
                desc.DOWN.call(this, this.globalData, delta);
              } else {
                cwt.Cursor.move(cwt.Move.MOVE_CODES_DOWN);
              }
              break;

            case cwt.Input.TYPE_ACTION:
              if (desc.ACTION) {
                desc.ACTION.call(this, this.globalData, delta);
              }
              break;

            case cwt.Input.TYPE_CANCEL:
              if (desc.CANCEL) {
                desc.CANCEL.call(this, this.globalData, delta);
              }
              break;
          }
        }
      },

      render: function (delta) {
        cwt.MapRenderer.evaluateCycle(delta);
        if (desc.render) {
          desc.render.call(this, this.globalData, delta);
        }
      }

    });
  },

  /**
   *
   * @param desc
   */
  addMenuState: function (desc) {
    cwt.Gameflow.addState({
      id: desc.id,

      init: function () {
        this.layout = new cwt.UIScreenLayout();
        this.rendered = false;

        this.inputMove = function (x, y) {
          if (this.layout.updateIndex(x, y)) {
            this.rendered = false;
          }
        };

        if (desc.init) {
          desc.init.call(this, this.layout);
        }

        if (desc.doLayout) {
          desc.doLayout.call(this, this.layout);
        }

        if (desc.genericInput) {
          this.genericInput = desc.genericInput;
        }
      },

      enter: function () {
        cwt.Screen.layerUI.clear();
        this.rendered = false;

        if (desc.enter) {
          desc.enter.call(this);
        }
      },

      update: function (delta, lastInput) {
        if (lastInput) {
          switch (lastInput.key) {

            case cwt.Input.TYPE_LEFT:
            case cwt.Input.TYPE_RIGHT:
            case cwt.Input.TYPE_UP:
            case cwt.Input.TYPE_DOWN:
              if (this.layout.handleInput(lastInput)) {
                this.rendered = false;
                cwt.Audio.playSound("MENU_TICK");
              }
              break;

            case cwt.Input.TYPE_ACTION:
              var button = this.layout.activeButton();
              button.action.call(this, button, this);
              this.rendered = false;
              cwt.Audio.playSound("ACTION");
              break;

            case cwt.Input.TYPE_CANCEL:
              if (desc.last) {
                cwt.Gameflow.changeState(desc.last);
                cwt.Audio.playSound("CANCEL");
              }
              break;
          }
        }
      },

      render: function (delta) {
        if (!this.rendered) {
          var ctx = cwt.Screen.layerUI.getContext();
          this.layout.draw(ctx);
          this.rendered = true;
        }
      }
    });
  },

  /**
   * Initializes the game state machine.
   */
  initialize: function () {
    if (cwt.DEBUG) {
      console.log("starting game state machine");
    }

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

       // check_ turn time
       if (cwt.Gameround.turnTimeLimit > 0 && cwt.Gameround.turnTimeElapsed >= cwt.Gameround.turnTimeLimit) {
       controller.commandStack_sharedInvokement("nextTurn_invoked");
       }

       // check_ game time
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

    // set start state
    this.setState("NONE", false);

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
      if (this.activeState.exit) {
        this.activeState.exit.call(this.activeState.data);
      }
    }

    // enter new state
    this.setState(stateId, true);
  },

  /**
   *
   * @param stateId
   */
  setState: function (stateId, fireEvent) {
    if (cwt.DEBUG) cwt.assert(this.states_.hasOwnProperty(stateId));

    if (cwt.DEBUG) {
      console.log("set active state to " + stateId + ((fireEvent) ? " with firing enter event" : ""));
    }

    this.activeState = this.states_[stateId];
    this.activeStateId = stateId;

    if (fireEvent !== false) {
      this.activeState.enter.call(this.activeState.data);
    }
  },

  /**
   *
   * @param delta
   */
  update: function (delta) {

    // update game-pad controls
    if (cwt.ClientFeatures.gamePad && cwt.Input.types.gamePad.update) {
      cwt.Input.types.gamePad.update();
    }

    // state update
    var inp = cwt.Input.popAction();
    this.activeState.update.call(this.activeState.data, delta, inp);
    this.activeState.render.call(this.activeState.data, delta);

    // release input data object
    if (inp) {
      cwt.Input.pool.push(inp);
    }
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