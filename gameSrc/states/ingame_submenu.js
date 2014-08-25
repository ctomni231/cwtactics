"use strict";

var constants = require("../constants.js");
var assert = require("../system/functions.js").assert;
var stateData = require("../dataTransfer/states");

exports.state = {
  id: "INGAME_SUBMENU",

  enter: function () {
    stateData.menu.clean();
    stateData.menu.generate();

    // go back when no entries exists
    if (stateData.menu.getSize() === 0) {
      throw Error("sub menu cannot be empty");
    }
  },

  ACTION: function () {
    if (stateData.menu.isEnabled()) {
      return;
    }

    var actName = stateData.menu.getContent();

    if (actName === "done") {
      this.changeState("INGAME_IDLE");
      return;
    }

    gameData.action.selectedSubEntry = actName;
    var actObj = cwt.Action.getActionObject(actName);

    var next = null;
    if (actObj.prepareTargets && actObj.targetSelectionType === "B") {
      // return this.data.selection.prepare();
    } else {
      next = "INGAME_FLUSH_ACTIONS";
    }

    if (constants.DEBUG) assert(next);
    this.changeState(next);
  },

  CANCEL: function () {
    this.changeState("INGAME_MENU");
  }
};
