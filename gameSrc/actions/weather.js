"use strict";

var weather = require("../logic/weather");
var sheets = require("../sheets");
var fog = require("../logic/fog");
var model = require("../model");

exports.action = {
  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.action.selectedEntry;
  },

  parseDataBlock: function (dataBlock) {
    weather.changeWeather(sheets.weathers.getSheet(dataBlock.p1));
    fog.fullRecalculation();
  }
};