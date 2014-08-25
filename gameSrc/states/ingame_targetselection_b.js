"use strict";

var stateData = require("../dataTransfer/states");

exports.state = {
  id: "INGAME_SELECT_TILE_TYPE_B",

  enter: function (gameData) {
    stateData.targetselection.clean();
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
};
