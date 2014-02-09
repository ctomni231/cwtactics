/**
 *
 * @namespace
 */
cwt.Weather = {

  /**
   * Calculates the next weather and adds the result as timed event to
   * the day events. **Only invokable by the host instance.**
   */
  calculateNextWeather: function (wth) {

    // this event is only host invokable
    assert(cwt.Network.isHost());

    // Search a random weather if the last weather
    // was `null` or the default weather type
    var newTp;
    var duration;
    if (cwt.Gameround.weather && cwt.Gameround.weather.defaultWeather) {

      var list = model.data_nonDefaultWeatherTypes;
      newTp = list[parseInt(Math.random() * list.length, 10)].ID;
      duration = 1;

    } else {

      // Take default weather and calculate a random amount of days
      newTp = model.data_defaultWeatherSheet.ID;
      duration = cwt.Config.getValue("weatherMinDays") +
        parseInt(cwt.Config.getValue("weatherRandomDays") * Math.random(), 10);
    }

    cwt.Gameround.weatherLeftDays = duration;
    this.changeWeather(newTp);
  },

  /**
   *
   */
  changeWeather: function (weather) {
    if (DEBUG) assert(cwt.WeatherSheet.isValidSheet(weather));

    cwt.Gameround.weather = weather;

    // recalculate fog map for client and turn owner due
    // possible weather effects
    this.fog.fullRecalculation();
    cwt.Client.fog.fullRecalculation();
  }
};