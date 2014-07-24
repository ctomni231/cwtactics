"use strict";

var storage = require("../storage");
var Config = require("../config").Config;

//
// @constant
//
var PARAM_WIPEOUT = "cwt_resetData";

//
// @constant
//
var PARAM_FORCE_TOUCH = "cwt_forceTouch";

//
// @constant
//
var PARAM_ANIMATED_TILES = "cwt_animatedTiles";

exports.save = function (cb) {
  storage.set(PARAM_FORCE_TOUCH, (Config.getValue("forceTouch") === 1), function () {
    storage.set(PARAM_ANIMATED_TILES, (Config.getValue("animatedTiles") === 1), function () {
      // invoke callback
      if (cb) cb();
    });
  });
};

exports.load = function (cb) {
  storage.get(PARAM_FORCE_TOUCH, function (obj) {
    if (obj) Config.getConfig("forceTouch").setValue(obj.value ? 1 : 0);

    storage.get(PARAM_ANIMATED_TILES, function (obj) {
      if (obj) Config.getConfig("animatedTiles").setValue(obj.value ? 1 : 0);

      // invoke callback
      if (cb) cb();
    });
  });
};