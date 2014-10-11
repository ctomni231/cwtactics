"use strict";

var weather = require("../logic/weather");
var sheets = require("../sheets");
var fog = require("../logic/fog");

exports.action = {
  invoke: function (weatherId) {
    weather.changeWeather(sheets.getSheet(sheets.TYPE_WEATHER, weatherId));
    fog.fullRecalculation();
  }
};
