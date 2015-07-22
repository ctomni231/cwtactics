"use strict";

var stateData = require("../dataTransfer/states");
var image = require("../image");
var renderer = require("../renderer");

exports.state = {
  id: "INGAME_SELECT_TILE_TYPE_A",

  enter: function () {
    stateData.targetselection.clean();
    stateData.focusMode = image.Sprite.FOCUS_MOVE;
    renderer.renderFocusOnScreen();
  },

  exit: function () {
    renderer.layerEffects.clear();
    renderer.layerFocus.clearAll();
    stateData.selection.clear();
  },

  ACTION: function (gameData) {
    if (stateData.selection.getValue(stateData.cursorX, stateData.cursorY) >= 0) {
      stateData.targetselection.set(stateData.cursorX, stateData.cursorY);
      this.changeState("INGAME_FLUSH_ACTIONS");
    }
  },

  CANCEL: function (gameData) {
    this.changeState("INGAME_MENU");
  }
}
