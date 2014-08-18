"use strict";

var functions = require("../system/functions");
var storage = require("../storage");
var Config = require("../config");

//
// @constant
//
var PARAM_WIPEOUT = "resetData";

//
// @constant
//
var PARAM_FORCE_TOUCH = "forceTouch";

//
// @constant
//
var PARAM_ANIMATED_TILES = "animatedTiles";

var loadParameter = function (paramName, callback) {
  storage.get(paramName, function (obj) {
    var value;

    if (obj) {
      Config.getConfig(paramName).setValue(obj.value ? 1 : 0);
    } else {
      var param = functions.getQueryParams(document.location.search)[paramName];
      if (typeof param !== "undefined") {
        value = (param === "1"? 1 : 0);
      }
    }

    if (typeof value !== "undefined") {
      Config.getConfig(paramName).setValue(value);
    }

    if (callback) callback();
  });
}

exports.save = function (callback) {
  storage.set(PARAM_FORCE_TOUCH, (Config.getValue("forceTouch") === 1), function () {
    storage.set(PARAM_ANIMATED_TILES, (Config.getValue("animatedTiles") === 1), function () {
      if (callback) callback();
    });
  });
};

exports.load = function (callback) {
  loadParameter(PARAM_FORCE_TOUCH, function () {
    loadParameter(PARAM_ANIMATED_TILES, callback);
  });
};

exports.wantResetData = function () {
  return (functions.getQueryParams(document.location.search)[PARAM_WIPEOUT] === "1");
};