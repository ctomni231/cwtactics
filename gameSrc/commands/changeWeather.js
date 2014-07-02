cwt.Action.engineAction({
  key: "changeWeather",

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.action.selectedEntry;
  },

  invokeFromData: function (dataBlock) {
    this.invoke(cwt.WeatherSheet.sheets[dataBlock.p1]);
  },

  invoke: function (weather) {
    if (this.DEBUG) cwt.assert(cwt.WeatherSheet.isValidSheet(weather));

    cwt.Gameround.weather = weather;

    // recalculate fog map for client and turn
    // owner due possible weather effects
    cwt.Fog.fullRecalculation();
  }

});