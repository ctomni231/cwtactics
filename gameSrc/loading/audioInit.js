"use strict";

var constants = require("../constants");
var features = require("../system/features");
var audioDTO = require("../dataTransfer/audio");

// Initializes the audio context of the game engine.
//
exports.loader = function (next, hasCachedData) {
  if (constants.DEBUG) {
    console.log("initializing audio system");
  }

  // don't load audio when disabled
  if (features.audioMusic || features.audioSFX) {
    var assetLoader = hasCachedData ? audioDTO.grabFromCache : audioDTO.grabFromRemote;

    // 1. load assets
    assetLoader(function () {

      // 2. load volume configuration
      audioDTO.loadVolumeConfigs(next);
    });

  } else {
    next();
  }
};