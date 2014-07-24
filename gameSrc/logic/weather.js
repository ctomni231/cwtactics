//
// Calculates the next weather and adds the result as timed event to
// the day events. **Only invokable by the host instance.**
//
exports.calculateNextWeather = function() {

  // this event is only host invokable
  cwt.assert(cwt.Network.isHost());

  // Search a random weather if the last weather
  // was `null` or the default weather type
  var newTp;
  var duration;
  if (cwt.Model.weather && cwt.Model.defaultWeather) {

    var list = cwt.DataSheets.weathers.types;
    newTp = cwt.selectRandomListElement(list, cwt.Model.weather.ID);
    duration = 1;

  } else {

    // Take default weather and calculate a random amount of days
    newTp = cwt.DataSheets.defaultWeather;
    duration = cwt.Config.getValue("weatherMinDays") +
      parseInt(cwt.Config.getValue("weatherRandomDays") * Math.random(), 10);
  }

  cwt.Model.weatherLeftDays = duration;
  this.changeWeather(newTp); // TODO: send message here
};

//
//
//
exports.changeWeather = function(weather) {
  if (this.DEBUG) cwt.assert(cwt.DataSheets.weathers.isValidSheet(weather));

  cwt.Model.weather = weather;

  // recalculate fog map for client and turn
  // owner due possible weather effects
  cwt.Fog.fullRecalculation();
};