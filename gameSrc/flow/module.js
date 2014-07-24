//
// Module to control and use the game state mechanic.
//
cwt.Gameflow = {

  // The id of the active game state.
  //
  activeStateId: null,

  // The active game state.
  //
  activeState: null,

  // Holds all registered game states.
  //
  states_: {},

  // State-Machine data object to share data between states.
  //
  globalData: {},

  //
  //
  // @param desc
  //
  addState: function (desc) {
    if (cwt.DEBUG) cwt.assert(!this.states_.hasOwnProperty(desc.id));

    var state = new cwt.GameState(
      desc.enter ? desc.enter : cwt.emptyFunction,
      desc.exit ? desc.exit : cwt.emptyFunction,
      desc.update ? desc.update : cwt.emptyFunction,
      desc.render ? desc.render : cwt.emptyFunction, {
        globalData: this.globalData
      }
    );

    if (desc.init) {
      desc.init.call(state.data, state.data.globalData);
    }

    this.states_[desc.id] = state;
  },

  //
  // Creates an inGame state which means this state is considered to be used in an active game round. As result this
  // state contains cursor handling and rendering logic.
  //
  addInGameState: function (desc) {
    cwt.Gameflow.addState({

      id: desc.id,

      init: function () {

        // mouse move handler
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
          var code = cwt.INACTIVE;
          var func = null;

          // extract input data
          switch (input.key) {
            case cwt.Input.TYPE_LEFT:
              func = "LEFT";
              code = cwt.Move.MOVE_CODES_LEFT;
              break;

            case cwt.Input.TYPE_UP:
              func = "UP";
              code = cwt.Move.MOVE_CODES_UP;
              break;

            case cwt.Input.TYPE_RIGHT:
              func = "RIGHT";
              code = cwt.Move.MOVE_CODES_RIGHT;
              break;

            case cwt.Input.TYPE_DOWN:
              func = "DOWN";
              code = cwt.Move.MOVE_CODES_DOWN;
              break;

            case cwt.Input.TYPE_ACTION:
              func = "ACTION";
              break;

            case cwt.Input.TYPE_CANCEL:
              func = "CANCEL";
              break;
          }

          // invoke action
          cwt.assert(func);
          if (desc[func]) {
            desc[func].call(this, this.globalData, delta);
          } else if (code != cwt.INACTIVE) {
            cwt.Cursor.move(code);
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

  //
  // Adds a menu state (normally this means all states that aren't inGame plus have input connection). Every menu state
  // will be designed with a **cwt.UIScreenLayoutObject** which can be configured by the **doLayout(layout)** function
  // property in the state description.
  //
  addMenuState: function (desc) {
    cwt.Gameflow.addState({
      id: desc.id,

      init: function () {
        this.layout = new cwt.UIScreenLayoutObject();
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

  //
  // Initializes the game state machine.
  //
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
    }

    // set start state
    this.setState("NONE", false);

    // enter the loop
    requestAnimationFrame(gameLoop);
  },

  // Changes the active state. The **exit event** will be fired during the change process in the old state and the
  // **enter event** in the new state.
  //
  changeState: function (stateId) {
    if (this.activeState) {
      if (this.activeState.exit) {
        this.activeState.exit.call(this.activeState.data);
      }
    }

    // enter new state
    this.setState(stateId, true);
  },

  //
  //
  // @param stateId
  //
  setState: function (stateId, fireEvent) {
    if (cwt.DEBUG) {
      cwt.assert(this.states_.hasOwnProperty(stateId));
      console.log("set active state to " + stateId + ((fireEvent) ? " with firing enter event" : ""));
    }

    this.activeState = this.states_[stateId];
    this.activeStateId = stateId;

    if (fireEvent !== false) {
      this.activeState.enter.call(this.activeState.data);
    }
  },

  //
  //
  // @param delta
  //
  update: function (delta) {

    // TODO add command evaluation here

    // update game-pad controls
    if (cwt.Config.features.gamePad && cwt.Input.types.gamePad.update) {
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