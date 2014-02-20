cwt.Action.engineAction({
  key: "changeWeather",

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.action.selectedEntry;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Weather.changeWeather(
      cwt.WeatherSheet.sheets[dataBlock.p1]);
  }
});