var fnc = require("./functions");
var input = require("./input");
var constants = require("./constants");
var features = require("./systemFeatures");

//
//
// @class
//
exports.GameState = my.Class({
  constructor: function (enterFn, exitFn, updateFn, renderFn ) {
    this.exit = exitFn;
    this.enter = enterFn;
    this.update = updateFn;
    this.render = renderFn;
  }
});

//
//
// @param desc
//
exports.addState = function (desc) {
  if (constants.DEBUG) fnc.assert(!states.hasOwnProperty(desc.id));

  var state = new exports.GameState(
    desc.enter ? desc.enter : fnc.emptyFunction,
    desc.exit ? desc.exit : fnc.emptyFunction,
    desc.update ? desc.update : fnc.emptyFunction,
    desc.render ? desc.render : fnc.emptyFunction
  );

  if (desc.init) {
    desc.init.call(state.data, state.data.globalData);
  }

  states[desc.id] = state;
};

//
// Creates an inGame state which means this state is considered to be used in an active game round. As result this
// state contains cursor handling and rendering logic.
//
exports.addInGameState = function (desc) {
  exports.addState({

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
        var code = constants.INACTIVE;
        var func = null;

        // extract input data
        switch (input.key) {
          case input.TYPE_LEFT:
            func = "LEFT";
            code = cwt.Move.MOVE_CODES_LEFT;
            break;

          case input.TYPE_UP:
            func = "UP";
            code = cwt.Move.MOVE_CODES_UP;
            break;

          case input.TYPE_RIGHT:
            func = "RIGHT";
            code = cwt.Move.MOVE_CODES_RIGHT;
            break;

          case input.TYPE_DOWN:
            func = "DOWN";
            code = cwt.Move.MOVE_CODES_DOWN;
            break;

          case input.TYPE_ACTION:
            func = "ACTION";
            break;

          case input.TYPE_CANCEL:
            func = "CANCEL";
            break;
        }

        // invoke action
        fnc.assert(func);
        if (desc[func]) {
          desc[func].call(this, this.globalData, delta);
        } else if (code != constants.INACTIVE) {
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
};

//
// Adds a menu state (normally this means all states that aren't inGame plus have input connection). Every menu state
// will be designed with a **cwt.UIScreenLayoutObject** which can be configured by the **doLayout(layout)** function
// property in the state description.
//
exports.addMenuState = function (desc) {
  exports.addState({
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

          case input.TYPE_LEFT:
          case input.TYPE_RIGHT:
          case input.TYPE_UP:
          case input.TYPE_DOWN:
            if (this.layout.handleInput(lastInput)) {
              this.rendered = false;
              cwt.Audio.playSound("MENU_TICK");
            }
            break;

          case input.TYPE_ACTION:
            var button = this.layout.activeButton();
            button.action.call(this, button, this);
            this.rendered = false;
            cwt.Audio.playSound("ACTION");
            break;

          case input.TYPE_CANCEL:
            if (desc.last) {
              exports.changeState(desc.last);
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
};

// Holds all registered game states.
//
var states = {};

// State-Machine data object to share data between states.
//
var globalData = {};

// The id of the active game state.
//
exports.activeStateId = null;

// The active game state.
//
exports.activeState = null;

//
//
// @param delta
//
var update = function (delta) {

  // TODO add command evaluation here

  // update game-pad controls
  if (features.gamePad && input.types.gamePad.update) {
    input.types.gamePad.update();
  }

  // state update
  var inp = input.popAction();
  this.activeState.update.call(this.activeState.data, delta, inp);
  this.activeState.render.call(this.activeState.data, delta);

  // release input data object
  if (inp) {
    input.releaseAction(inp);
  }
};

// Changes the active state. The **exit event** will be fired during the change process in the old state and the
// **enter event** in the new state.
//
exports.changeState = function (stateId) {
  if (this.activeState) {
    if (this.activeState.exit) {
      this.activeState.exit.call(this.activeState.data);
    }
  }

  // enter new state
  this.setState(stateId, true);
};

//
//
// @param stateId
//
exports.setState = function (stateId, fireEvent) {
  if (constants.DEBUG) {
    fnc.assert(states.hasOwnProperty(stateId));
    console.log("set active state to " + stateId + ((fireEvent) ? " with firing enter event" : ""));
  }

  this.activeState = states[stateId];
  this.activeStateId = stateId;

  if (fireEvent !== false) {
    this.activeState.enter.call(this.activeState.data);
  }
};

//
// Initializes the game state machine.
//
exports.initialize = function () {
  if (constants.DEBUG) {
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
    update(delta);
  }

  // set start state
  this.setState("NONE", false);

  // enter the loop
  requestAnimationFrame(gameLoop);
};