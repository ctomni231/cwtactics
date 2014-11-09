"use strict";

var stateData = require("../states");

exports.state = {
  id: "INGAME_MULTISTEP_IDLE",

  enter: function () {
    stateData.inMultiStep = false;
  }
};
