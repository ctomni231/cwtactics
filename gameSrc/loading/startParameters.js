"use strict";

var configDTO = require("../dataTransfer/config");
var constants = require("../constants");
var features = require("../systemFeatures");
var storage = require("../storage");
var async = require("../async");

var checkWipeOut = function (next) {
  if (configDTO.wantResetData()) {
    if (constants.DEBUG) console.log("wipe out cached data");

    storage.clear(function () {
      document.location.reload();
    });

  } else {
    next();
  }
};

var checkForceTouch = function (next) {
  var cfg = require("../config").getConfig("forceTouch");
  if (cfg.value === 1) {

    // enable touch and disable mouse ( cannot work together )
    features.mouse = false;
    features.touch = true;
  }

  next();
};

exports.loader = function (nextLoadingStep) {
  if (constants.DEBUG) console.log("checking options");

  async.sequence([
    checkWipeOut,
    configDTO.load,
    checkForceTouch,
    function () {
      nextLoadingStep();
    }
  ]);
};