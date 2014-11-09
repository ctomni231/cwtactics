"use strict";

var constants = require("./constants");
var stateData = require("./states");
var features = require("./system/features");
var renderer = require("./renderer");
var widgets = require("./gui");
var input = require("./input");
var audio = require("./audio");
var actions = require("./actions");
var image = require("./image");
var move = require("./logic/move");
var fnc = require("./system/functions");

var gamePad = require("./input/gamepad");

//
//
// @class
//
exports.GameState = my.Class({
  constructor: function(enterFn, exitFn, updateFn, renderFn) {
    this.exit = exitFn;
    this.enter = enterFn;
    this.update = updateFn;
    this.render = renderFn;
  },

  changeState: function(stateId) {
    exports.changeState(stateId);
  }
});

// Holds all registered game states.
//
var states = {};

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
var update = function(delta) {

  if (exports.activeState.animation) {
    exports.activeState.update(delta);
    exports.activeState.render(delta);
    return;
  }

  // try to evaluate commands first
  if (actions.hasData()) {
    actions.invokeNext();
    return;
  }

  // update game-pad controls
  if (features.gamePad && gamePad.update) {
    gamePad.update();
  }

  // state update
  var inp = input.popAction();
  exports.activeState.update(delta, inp);
  exports.activeState.render(delta);

  // release input data object
  if (inp) {
    input.releaseAction(inp);
  }
};

// Changes the active state. The **exit event** will be fired during the change process in the old state and the
// **enter event** in the new state.
//
exports.changeState = function(stateId) {
  if (exports.activeState) {
    if (exports.activeState.exit) {
      exports.activeState.exit();
    }
  }

  // enter new state
  this.setState(stateId, true);
};

//
//
// @param stateId
//
exports.setState = function(stateId, fireEvent) {
  if (constants.DEBUG) {
    fnc.assert(states.hasOwnProperty(stateId));
    console.log("set active state to " + stateId + ((fireEvent) ?
      " with firing enter event" : ""));
  }

  exports.activeState = states[stateId];
  exports.activeStateId = stateId;

  if (fireEvent !== false) {
    exports.activeState.enter();
  }
};

var started = false;

// Starts the game state machine.
//
exports.start = function() {
  if (started) throw Error("already started");
  started = true;

  if (constants.DEBUG) {
    console.log("starting game state machine");
  }

  var oldTime = new Date().getTime();

  function gameLoop() {

    // calculate delta
    var now = new Date().getTime();
    var delta = now - oldTime;
    oldTime = now;

    // update machine
    update(delta);

    // acquire next frame
    requestAnimationFrame(gameLoop);
  }

  // inject loading states
  addState(require("./states/start_none").state);
  addState(require("./states/start_load").state);

  // set start state
  exports.setState("NONE", false);

  // enter the loop
  requestAnimationFrame(gameLoop);
};


//
//
// @param desc
//
var addState = function(desc) {
  fnc.assert(!states.hasOwnProperty(desc.id), "state " + desc.id + " is already registered");

  var state = new exports.GameState(
    desc.enter ? desc.enter : fnc.emptyFunction,
    desc.exit ? desc.exit : fnc.emptyFunction,
    desc.update ? desc.update : fnc.emptyFunction,
    desc.render ? desc.render : fnc.emptyFunction
  );

  if (desc.init) {
    desc.init.call(state);
  }

  states[desc.id] = state;

  state.animation = false;

  return state;
};

var addAnimationState = function(desc) {
  var currentStateNum;
  var states = desc.states;

  var state = addState({

    id: desc.id,

    init: function() {
      if (desc.init) {
        desc.init.apply(this,arguments);
      }
    },

    enter: function() {
      currentStateNum = 0;

      if (desc.enter) {
        desc.enter.apply(this,arguments);
      }
    },

    exit: function() {
      if (desc.exit) {
        desc.exit.apply(this,arguments);
      }
    },

    update: function(delta, lastInput) {
      if (desc.update(delta, lastInput, currentStateNum)) {
        currentStateNum++;
        if (currentStateNum === states) {
          this.changeState(desc.nextState);
        }
      }
    },

    render: function(delta) {
      renderer.evaluateCycle(delta);
      if (desc.render) {
        desc.render.call(this, delta, currentStateNum);
      }
    }
  });

  state.animation = true;
};
//
// Creates an inGame state which means this state is considered to be used in an active game round. As result this
// state contains cursor handling and rendering logic.
//
var addInGameState = function(desc) {
  addState({

    id: desc.id,

    init: function() {

      // mouse move handler
      this.inputMove = function(x, y) {
        if (desc.inputMove) {
          desc.inputMove.call(this, x, y);
        } else {
          stateData.setCursorPosition(
            renderer.convertToTilePos(x),
            renderer.convertToTilePos(y),
            true
          );
        }
      };

      if (desc.init) {
        desc.init.apply(this,arguments);
      }
    },

    enter: function() {
      if (desc.enter) {
        desc.enter.apply(this,arguments);
      }
    },

    exit: function() {
      if (desc.exit) {
        desc.exit.apply(this,arguments);
      }
    },

    update: function(delta, lastInput) {
      if (lastInput) {
        var code = constants.INACTIVE;
        var func = null;

        // extract input data
        switch (lastInput.key) {
          case input.TYPE_LEFT:
            func = "LEFT";
            code = move.MOVE_CODES_LEFT;
            break;

          case input.TYPE_UP:
            func = "UP";
            code = move.MOVE_CODES_UP;
            break;

          case input.TYPE_RIGHT:
            func = "RIGHT";
            code = move.MOVE_CODES_RIGHT;
            break;

          case input.TYPE_DOWN:
            func = "DOWN";
            code = move.MOVE_CODES_DOWN;
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
          desc[func].call(this, delta);
        } else if (code != constants.INACTIVE) {
          stateData.moveCursor(code);
        }
      }
    },

    render: function(delta) {
      renderer.evaluateCycle(delta);
      if (desc.render) {
        desc.render.call(this, delta);
      }
    }

  });
};

//
// Adds a menu state (normally this means all states that aren't inGame plus have input connection). Every menu state
// will be designed with a **cwt.UIScreenLayout** which can be configured by the **doLayout(layout)** function
// property in the state description.
//
var addMenuState = function(desc) {
  var layout = new widgets.UIScreenLayout();
  var rendered = false;

  addState({
    id: desc.id,

    init: function() {

      this.inputMove = function(x, y) {
        if (layout.updateIndex(x, y)) {
          rendered = false;
        }
      };

      if (desc.init) {
        desc.init.call(this, layout);
      }

      if (desc.doLayout) {
        desc.doLayout.call(this, layout);
      }

      if (desc.genericInput) {
        this.genericInput = desc.genericInput;
      }

      this.doRender = function() {
        rendered = false;
      };
    },

    enter: function() {
      renderer.layerUI.clear(constants.INACTIVE);
      rendered = false;

      if (desc.enter) {
        desc.enter.call(this, layout);
      }
    },

    update: function(delta, lastInput) {
      if (lastInput) {
        switch (lastInput.key) {

          case input.TYPE_LEFT:
          case input.TYPE_RIGHT:
          case input.TYPE_UP:
          case input.TYPE_DOWN:
            if (layout.handleInput(lastInput)) {
              rendered = false;
              audio.playSound("MENU_TICK");
            }
            break;

          case input.TYPE_ACTION:
            var button = layout.activeButton();
            button.action.call(this, button, this);
            rendered = false;
            audio.playSound("ACTION");
            break;

          case input.TYPE_CANCEL:
            if (desc.last) {
              exports.changeState(desc.last);
              audio.playSound("CANCEL");
            }
            break;
        }
      }
    },

    render: function(delta) {
      if (!rendered) {
        var ctx = renderer.layerUI.getContext(constants.INACTIVE);
        layout.draw(ctx);
        rendered = true;
      }
    }
  });
};