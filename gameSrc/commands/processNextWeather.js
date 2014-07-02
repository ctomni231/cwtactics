cwt.Action.engineAction({
  key: "processNextWeather",

  toDataBlock: function (data, dataBlock) {
  },

  invokeFromData: function (dataBlock) {
    this.invoke();
  },

  invoke: function () {

    // this event is only host invokable
    cwt.assert(cwt.Network.isHost());

    // Search a random weather if the last weather
    // was `null` or the default weather type
    var newTp;
    var duration;
    if (cwt.Gameround.weather && cwt.Gameround.weather.defaultWeather) {

      var list = cwt.WeatherSheet.types;
      newTp = cwt.selectRandomListElement(list, cwt.Gameround.weather);
      duration = 1;

    } else {

      // Take default weather and calculate a random amount of days
      newTp = cwt.WeatherSheet.defaultWeather;
      duration = cwt.Config.getValue("weatherMinDays") +
        parseInt(cwt.Config.getValue("weatherRandomDays") * Math.random(), 10);
    }

    cwt.Gameround.weatherLeftDays = duration;
    this.changeWeather(newTp); // TODO: send message here
  }

});