var storage = require("./storage");

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
  "use strict";

  storage.set(PARAM_ANIMATED_TILES, cwt.Config.getValue("animatedTiles") === 1, function () {
    storage.set(PARAM_FORCE_TOUCH, cwt.Config.getValue("forceTouch") === 1, function () {
      if (cb) {
        cb();
      }
    });
  });
};

exports.load = function (cb) {
  "use strict";

  storage.get(PARAM_ANIMATED_TILES, function (obj) {
    if (obj) {
      cwt.Config.getConfig("animatedTiles").setValue(obj.value ? 1 : 0);
    }

    storage.get(PARAM_FORCE_TOUCH, function (obj) {
      if (obj) {
        cwt.Config.getConfig("forceTouch").setValue(obj.value ? 1 : 0);
      }

      if (cb) {
        cb();
      }
    });
  });
};