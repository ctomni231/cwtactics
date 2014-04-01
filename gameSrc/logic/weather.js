/**
 * Weather logic module.
 *
 * @namespace
 */
cwt.Weather = {

  /**
   * Calculates the next weather and adds the result as timed event to
   * the day events. **Only invokable by the host instance.**
   */
  calculateNextWeather: function () {

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
  },

  /**
   *
   */
  changeWeather: function (weather) {
    if (this.DEBUG) cwt.assert(cwt.WeatherSheet.isValidSheet(weather));

    cwt.Gameround.weather = weather;

    // recalculate fog map for client and turn
    // owner due possible weather effects
    cwt.Fog.fullRecalculation();
  }
};