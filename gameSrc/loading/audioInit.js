"use strict";

var constants = require("../constants");
var features = require("../systemFeatures");
var loading = require('../loading');
var audioDTO = require("../dataTransfer/audio");

// Initializes the audio context of the game engine.
//
loading.addHandler(function (next) {
  if (constants.DEBUG) {
    console.log("initializing audio system");
  }

  // don't load audio when disabled
  if (features.audioMusic || features.audioSFX) {
    var assetLoader = loading.hasCachedData ? audioDTO.grabFromCache : audioDTO.grabFromRemote;

    // 1. load assets
    assetLoader(function () {

      // 2. load volume configuration
      audioDTO.loadVolumeConfigs(next);
    });

  } else {
    next();
  }
});