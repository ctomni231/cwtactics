var inpMapping = require("../dataTransfer/keyMapping");
var constants = require("../constants");
var features = require('../systemFeatures');
var loading = require('../loading');

loading.addHandler(function (next) {
  if (constants.DEBUG) console.log("initializing input system");

  // enable input backend
  if (!features.keyboard) require("../input/keyboard").backend.enable();
  if (!features.gamePad) require("../input/gamepad").backend.enable();
  if (!features.mouse) require("../input/mouse").backend.enable();
  if (!features.touch) require("../input/touch").backend.enable();

  inpMapping.load(next);
});