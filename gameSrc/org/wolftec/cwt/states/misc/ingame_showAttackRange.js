"use strict";

var constants = require("../constants");
var stateData = require("../dataTransfer/states");
var renderer = require("../renderer");
var attack = require("../logic/attack");
var image = require("../image");

// State that shows the attack range of an unit object. If the unit is a direct attacking unit, then the
// attack range is moving range + attack range together, to show every field that will be attack able. Otherwise
// only the attack range will be shown.
//
exports.state = {
  id: "INGAME_SHOW_ATTACK_RANGE",

  enter: function () {
    stateData.focusMode = image.Sprite.FOCUS_ATTACK;
    attack.fillRangeMap(stateData.source.unit, stateData.source.x, stateData.source.y, stateData.selection);
    renderer.renderFocusOnScreen();
  },

  exit: function () {
    renderer.layerEffects.clear();
    renderer.layerFocus.clearAll();
    stateData.selection.clear();
  },

  CANCEL: function () {
    stateData.focusMode = constants.INACTIVE;
    this.changeState("INGAME_IDLE");
  }
};