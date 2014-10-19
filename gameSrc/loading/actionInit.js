"use strict";

var debug = require('../debug');

exports.loader = function (next) {
  debug.logInfo("initialising action system");

  // load default actions

  // load actions from modification hook

  next();
};