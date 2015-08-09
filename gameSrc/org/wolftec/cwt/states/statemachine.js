
/*
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

var initialized = false;
exports.addStates = function() {
  if (initialized) throw Error("already started");
  initialized = true;

  addState(require("./states/start_tooltip").state);
  addState(require("./states/portrait").state);
  addState(require("./states/error").state);

  addMenuState(require("./states/menu_main").state);

  addMenuState(require("./states/options_remap").state);
  addMenuState(require("./states/options_confirmWipeOut").state);
  addMenuState(require("./states/options_main").state);

  addState(require("./test/rain").state);
  addState(require("./test/weather").state);

  addMenuState(require("./states/menu_versus").state);
  addMenuState(require("./states/menu_playerSetup").state);
  addMenuState(require("./states/menu_parameterSetup").state);

  addInGameState(require("./states/ingame_enter").state);
  addInGameState(require("./states/ingame_idle").state);
  addInGameState(require("./states/ingame_leave").state);
  addInGameState(require("./states/ingame_movepath").state);
  addInGameState(require("./states/ingame_menu").state);
  addInGameState(require("./states/ingame_showAttackRange").state);

  addInGameState(require("./states/ingame_flush").state);

  addInGameState(require("./states/ingame_multistep").state);
  addInGameState(require("./states/ingame_selecttile").state);
  addInGameState(require("./states/ingame_submenu").state);
  addInGameState(require("./states/ingame_targetselection_a").state);
  addInGameState(require("./states/ingame_targetselection_b").state);

  addAnimationState(require("./states/ingame_anim_move").state);
  addAnimationState(require("./states/ingame_anim_siloFire").state);
  addAnimationState(require("./states/ingame_anim_captureProperty").state);
  addAnimationState(require("./states/ingame_anim_changeWeather").state);
  addAnimationState(require("./states/ingame_anim_destroyUnit").state);
  addAnimationState(require("./states/ingame_anim_nextTurn").state);
  addAnimationState(require("./states/ingame_anim_trapWait").state);
};

*/