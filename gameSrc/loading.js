//
// The data loading process.
//

var constants = require("./constants");
var storage = require("./storage");

var initialized = false;

//
// @private
//
var loaders = [];

//
//
exports.hasCachedData = false;

//
// Adds a loading function in the loading process.
//
// @param {Function} loader
//
exports.addHandler = function (loader) {
  this.loaders_.push(loader);
};

//
// Starts the loading process. After the loading process the loading stuff will be removed. The Loading namespace
// will remain with a property with value true as marker. This property will be named deInitialized.
//
// @param {Function} callback
//
exports.startProcess = function (loadingBar, callback) {
  if (constants.DEBUG) {
    console.log("start loading process");
  }

  function setProgress(bar, i) {
    return function (next) {
      bar.setPercentage(i);
      next();
    }
  }

  this.hasCachedData = storage.get("cwt_hasCache");

  var xloaders = [];
  var step = parseInt(100 / loaders.length);
  for (var i = 0, e = loaders.length; i < e; i++) {
    xloaders.push(loaders[i]);
    xloaders.push(setProgress(loadingBar, (i + 1) * step));
  }

  callAsSequence(xloaders, function () {

    // remove functions that never be called again
    this.loaders_ = null;
    this.create = null;
    this.startProcess = null;

    // invoke callback if given
    if (callback) {
      storage.set("cwt_hasCache", true);

      callback();
    }
  });
};