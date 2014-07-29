//
// State that shows the attack range of an unit object. If the unit is a direct attacking unit, then the
// attack range is moving range + attack range together, to show every field that will be attack able. Otherwise
// only the attack range will be shown.
//
// @memberOf require("../statemachine")
// @name INGAME_SHOW_ATTACK_RANGE
//
require("../statemachine").addInGameState({
  id: "INGAME_SHOW_ATTACK_RANGE",

  enter: function () {
    // TODO: prepare range
    // TODO: render range to layer
  },

  exit: function () {
    cwt.Screen.layerEffects.clear();
  },

  CANCEL: function () {
    require("../statemachine").changeState("INGAME_IDLE");
  }
});