"use strict";

var selectRandom = require("../system/functions").selectRandomListElement;
var network = require("../network");
var assert = require("../system/functions").assert;
var sheets = require("../sheets");
var model = require("../model");

var cfgMinDays = require("../config").getConfig("weatherMinDays");
var cfgRandomDays = require("../config").getConfig("weatherRandomDays");

// Picks a random weather id in relation to the current action weather.
//
exports.pickRandomWeatherId = function() {

  // Search a random weather if the last weather was `null` or the default weather type
  var newTp;
  if (model.weather && model.weather === sheets.defaultWeather) {
    var list = sheets.weathers.types;
    newTp = selectRandom(list, model.weather.ID);

  } else {
    // Take default weather and calculate a random amount of days
    newTp = sheets.defaultWeather;
  }

  return newTp.ID;
};

// Picks a random duration for a given weather type.
//
exports.pickRandomWeatherTime = function(type) {
  return (type === sheets.defaultWeather.ID)? 1 :
    (cfgMinDays.value + parseInt(cfgRandomDays.value * Math.random(), 10));
};

// Changes the weather and sets the left days.
//
exports.changeWeather = function(weather, duration) {
  if (this.DEBUG) assert(sheets.weathers.isValidSheet(weather));
  model.weather = weather;
  model.weatherLeftDays = duration;
};