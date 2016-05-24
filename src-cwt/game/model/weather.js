const baseWeatherType = {
  defaultWeather: false,
  minDuration: 1,
  maxDuration: 4
};

const weatherTypeValidators = {
  defaultWeather: cwt.types.isBoolean,
  minDuration: cwt.types.isInteger,
  maxDuration: cwt.types.isBoolean
};

const weathertypeValidator = function(data) {
  return Object.keys(data).every(key => weatherTypeValidators[key](data[key]));
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