const weathertypeValidator = function(data) {
  return cwt.all([
    cwt.types.isBoolean(data.defaultWeather),
    cwt.types.isInteger(data.minDuration),
    cwt.types.isBoolean(data.maxDuration)
  ]);
};

const weather = {

  setWeather(id) {
    this.active = this.types.getSheet(id);
    let duration = this.active.minDuration;
    duration += parseInt(Math.random() * (this.active.maxDuration - duration), 10);
    this.leftDays = duration;
    this.events.publish("weather:changed:" + id, duration);
  },

  decreaseLeftDays() {
    this.leftDays--;
    if (this.leftDays == 0) {
      this.setWeather(this.types.getRandom().id);
    }
  }
};

cwt.getWeathertypeValidator = function() {
  return weathertypeValidator;
};

cwt.produceWeather = function(events) {
  var weather = Object.assign(Object.create(weather), {
    events
  });

  events.subscribe("turn:day", () => weather.decreaseLeftDays());

  return weather;
};