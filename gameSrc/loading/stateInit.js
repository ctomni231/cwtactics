"use strict";

var stateMachine = require("../statemachine");
var debug = require('../debug');

exports.loader = function (next) {
  debug.logInfo("initialising state machine");

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

  next();
};