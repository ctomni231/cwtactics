"use strict";

var sheets = require("../sheets");
var weather = require("../logic/weather");
var fog = require("../logic/fog");

exports.action = {
  invoke: function (weatherId) {
    weather.changeWeather(sheets.weathers.getSheet(weatherId));
    fog.fullRecalculation();
  }
};