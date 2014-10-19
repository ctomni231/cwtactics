"use strict";

var inpMapping = require("../dataTransfer/keyMapping");
var constants = require("../constants");
var features = require('../system/features');
var debug = require('../debug');

exports.loader = function (next) {
  debug.logInfo("initializing input system");

  if (features.keyboard) {
    require("../input/keyboard").backend.enable();
  }

  if (features.gamePad) {
    require("../input/gamepad").backend.enable();
  }

  if (features.mouse) {
    require("../input/mouse").backend.enable();
  }

  if (features.touch) {
    require("../input/touch").backend.enable();
  }

  inpMapping.load(next);
};
