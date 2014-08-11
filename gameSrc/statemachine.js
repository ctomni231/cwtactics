"use strict";

var constants = require("./constants");
var stateData = require("./dataTransfer/states");
var features = require("./systemFeatures");
var renderer = require("./renderer");
var widgets = require("./uiWidgets");
var input = require("./input");
var audio = require("./audio");
var image = require("./image");
var move = require("./logic/move");
var fnc = require("./functions");

var gamePad = require("./input/gamepad");

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
  },

  audio: audio,
  input: input,
  image: image,
  data: stateData,
  renderer: renderer,

  changeState: function (stateId) {
    exports.changeState(stateId);
  }
});

//
//
// @param desc
//
var addState = function (desc) {
  if (constants.DEBUG) fnc.assert(!states.hasOwnProperty(desc.id));

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
};

//
// Creates an inGame state which means this state is considered to be used in an active game round. As result this
// state contains cursor handling and rendering logic.
//
var addInGameState = function (desc) {
  addState({

    id: desc.id,

    init: function () {

      // mouse move handler
      this.inputMove = function (x, y) {
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
        desc.init.call(this);
      }
    },

    enter: function () {
      if (desc.enter) {
        desc.enter.call(this);
      }
    },

    exit: function () {
      if (desc.exit) {
        desc.exit.call(this);
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

    render: function (delta) {
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
var addMenuState = function (desc) {
  var layout = new widgets.UIScreenLayout();
  var rendered = false;

  addState({
    id: desc.id,

    init: function () {

      this.inputMove = function (x, y) {
        if (layout.updateIndex(x, y)) {
          this.rendered = false;
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
    },

    enter: function () {
      renderer.layerUI.clear();
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
            if (layout.handleInput(lastInput)) {
              this.rendered = false;
              audio.playSound("MENU_TICK");
            }
            break;

          case input.TYPE_ACTION:
            var button = layout.activeButton();
            button.action.call(this, button, this);
            this.rendered = false;
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

    render: function (delta) {
      if (!rendered) {
        var ctx = renderer.layerUI.getContext();
        layout.draw(ctx);
        rendered = true;
      }
    }
  });
};

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
var update = function (delta) {

  // TODO add command evaluation here

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
exports.changeState = function (stateId) {
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
exports.setState = function (stateId, fireEvent) {
  if (constants.DEBUG) {
    fnc.assert(states.hasOwnProperty(stateId));
    console.log("set active state to " + stateId + ((fireEvent) ? " with firing enter event" : ""));
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
exports.start = function () {
  if (started) throw Error("already started");
  started = true;

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
  exports.setState("NONE", false);

  // enter the loop
  requestAnimationFrame(gameLoop);
};

// inject all game states

addState(require("./states/start_none").state);
addState(require("./states/start_load").state);
addState(require("./states/start_tooltip").state);

/*
addState(require("./states/portrait").state);
addState(require("./states/error").state);

addMenuState(require("./states/menu_main").state);
addMenuState(require("./states/menu_parameterSetup").state);
addMenuState(require("./states/menu_playerSetup").state);
addMenuState(require("./states/menu_versus").state);

addMenuState(require("./states/options_remap").state);
addMenuState(require("./states/options_confirmWipeOut").state);
addMenuState(require("./states/options_main").state);

addInGameState(require("./states/ingame_enter").state);
addInGameState(require("./states/ingame_flush").state);
addInGameState(require("./states/ingame_idle").state);
addInGameState(require("./states/ingame_leave").state);
addInGameState(require("./states/ingame_menu").state);
addInGameState(require("./states/ingame_movepath").state);
addInGameState(require("./states/ingame_multistep").state);
addInGameState(require("./states/ingame_selecttile").state);
addInGameState(require("./states/ingame_showAttackRange").state);
addInGameState(require("./states/ingame_submenu").state);
addInGameState(require("./states/ingame_targetselection_a").state);
addInGameState(require("./states/ingame_targetselection_b").state);

addState(require("./states/ingame_anim_ballistic").state);
addState(require("./states/ingame_anim_captureProperty").state);
addState(require("./states/ingame_anim_changeWeather").state);
addState(require("./states/ingame_anim_destroyUnit").state);
addState(require("./states/ingame_anim_move").state);
addState(require("./states/ingame_anim_nextTurn").state);
addState(require("./states/ingame_anim_trapWait").state);
  */