"use strict";

var PARAM_HAS_CACHE = "__hasCache__";

var constants = require("./constants");
var storage = require("./storage");
var hasCachedData = false;

//
// Starts the loading process. After the loading process the loading stuff will be removed. The Loading namespace
// will remain with a property with value true as marker. This property will be named deInitialized.
//
// @param {Function} callback
//
exports.startProcess = function (loadingBar, callback) {
  function setProgress(i) {
    return function (next) {
      loadingBar.setPercentage(i);
      next();
    }
  }

  function setLoader(mod) {
    return (function (next) {
      mod.loader(next, hasCachedData);
    })
  }

  if (constants.DEBUG) console.log("start loading process");
  storage.get(PARAM_HAS_CACHE, function (value) {
    hasCachedData = value;
    callAsSequence(

      setLoader(require("./loading/checkSystem")),
      setProgress(5),
      setLoader(require("./loading/startParameters")),
      setProgress(10),
      setLoader(require("./loading/language")),
      setProgress(25),
      setLoader(require("./loading/imageLoad")),
      setProgress(50),
      setLoader(require("./loading/audioInit")),
      setProgress(75),
      setLoader(require("./loading/inputInit")),
      setProgress(80),
      setLoader(require("./loading/loadMaps")),
      setProgress(90),
      setLoader(require("./loading/portraitCheck")),
      setProgress(100),

      function () {
        if (callback) {
          if (constants.DEBUG) console.log("start loading process");

          storage.set(PARAM_HAS_CACHE, true);
          callback();
        }
      }
    );
  });
};