"use strict";

var constants = require("./constants");
var stateData = require("./stateData");
var features = require("./features");
var renderer = require("./renderer");
var widgets = require("./gui");
var input = require("./input");
var audio = require("./audio");
var actions = require("./actions");
var image = require("./image");
var move = require("./logic/move");
var fnc = require("./system/functions");

var gamePad = require("./input/gamepad");y

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