"use strict";

var selectRandom = require("../functions").selectRandomListElement;
var network = require("../network");
var assert = require("../functions").assert;
var sheets = require("../sheets");
var model = require("../model");

var cfgMinDays = require("../config").getConfig("weatherMinDays");
var cfgRandomDays = require("../config").getConfig("weatherRandomDays");

//
// Calculates the next weather and adds the result as timed event to
// the day events. **Only invokable by the host instance.**
//
exports.calculateNextWeather = function() {

  // this event is only host invokable
  assert(network.isHost());

  // Search a random weather if the last weather
  // was `null` or the default weather type
  var newTp;
  var duration;
  if (model.weather && model.defaultWeather) {

    var list = sheets.weathers.types;
    newTp = selectRandom(list, model.weather.ID);
    duration = 1;

  } else {

    // Take default weather and calculate a random amount of days
    newTp = sheets.defaultWeather;
    duration = cfgMinDays.value + parseInt(cfgRandomDays.value * Math.random(), 10);
  }

  model.weatherLeftDays = duration;
  this.changeWeather(newTp); // TODO send message here
};

//
//
//
exports.changeWeather = function(weather) {
  if (this.DEBUG) assert(sheets.weathers.isValidSheet(weather));
  sheets.weather = weather;
};