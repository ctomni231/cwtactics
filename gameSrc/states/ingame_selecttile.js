"use strict";

var stateData = require("../states");

exports.state = {
  id: "INGAME_SELECT_TILE",

  enter: function () {
    stateData.targetselection.clean();

    /*
     var prepareSelection = this.data.action.object.prepareSelection;
     if (prepareSelection) prepareSelection(this.data);
     else this.data.selectionRange = 1;
    */
  },

  ACTION: function () {
    if (stateData.action.object.isTargetValid(stateData.cursorX, stateData.cursorY)) {
      gameData.targetselection.set(stateData.cursorX, stateData.cursorY);
      this.changeState("INGAME_FLUSH_ACTIONS");
    }
  },

  CANCEL: function () {
    this.changeState("INGAME_MENU");
  }
};
