"use strict";

var stateData = require("../dataTransfer/states");

exports.state = {
  id: "INGAME_IDLE",

  enter: function () {
    stateData.source.clean();
    stateData.target.clean();
    stateData.targetselection.clean();
  },

  ACTION: function () {
    var x = stateData.cursorX;
    var y = stateData.cursorY;

    stateData.source.set(x, y);
    stateData.target.set(x, y);

    this.changeState("INGAME_MOVEPATH");
  }
};
