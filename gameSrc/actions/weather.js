"use strict";

require('../actions').engineAction({
  key: "changeWeather",

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.action.selectedEntry;
  },

  parseDataBlock: function (dataBlock) {
    this.invoke(cwt.WeatherSheet.sheets[dataBlock.p1]);
  },

  invoke: function (weather) {
    cwt.Weather.changeWeather(weather);
    cwt.Fog.fullRecalculation();
  }
});