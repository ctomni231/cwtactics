"use strict";

var configDTO = require("../dataTransfer/config");
var constants = require("../constants");
var features = require("../systemFeatures");
var storage = require("../storage");

var checkWipeOut = function (next) {
  if (configDTO.wantResetData()) {
    if (constants.DEBUG) console.log("wipe out cached data");

    storage.clear(function () {
      next();
    });

  } else {
    next();
  }
};

var checkForceTouch = function (next) {
  var cfg = require("../config").getConfig("forceTouch");
  if (cfg.getValue() === 1) {

    // enable touch and disable mouse ( cannot work together )
    features.mouse = false;
    features.touch = true;

    next();
  }
};

exports.loader = function (nextLoadingStep) {
  if (constants.DEBUG) console.log("checking options");

  callAsSequence([
    checkWipeOut,
    configDTO.load,
    checkForceTouch,
    function () {
      nextLoadingStep();
    }
  ]);
};