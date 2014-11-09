"use strict";

var renderer = require("../renderer");
var constants = require("../constants");

var stateData = require("../states");

exports.state = {
  id: "INGAME_LEAVE",

  enter: function () {
    stateData.inGameRound = false;
    renderer.showNativeCursor();

    if (constants.DEBUG) console.log("exiting game round");
  }
};
