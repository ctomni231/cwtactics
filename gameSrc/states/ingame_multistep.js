"use strict";

var stateData = require("../dataTransfer/states");

exports.state = {
  id: "INGAME_MULTISTEP_IDLE",

  enter: function () {
    stateData.inMultiStep = false;
  }
};
