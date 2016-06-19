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

/**
  @return (data) => xyz..
*/
cwt.produceWeathertypeValidator = function() {
  return data => Object
    .keys(data)
    .every(key => weatherTypeValidators[key](data[key]));
};

/**

  @return {
    setWeather(id:string)
      throws event weather:changed:{id}

    decreaseLeftDays()
  }
*/
cwt.produceWeather = function(types, events) {
  events.subscribe("turn:day", () => weather.decreaseLeftDays());

  var leftDays = 0;
  var active = null;

  const setWeather = function(id) {
    active = types.getSheet(id);
    let duration = active.minDuration;
    duration += parseInt(Math.random() * (active.maxDuration - duration), 10);
    leftDays = duration;
    events.publish("weather:changed:" + id, duration);
  };

  const decreaseLeftDays = function() {
    leftDays--;
    if (leftDays == 0) {
      setWeather(types.getRandom().id);
    }
  };

  return {
    setWeather,
    decreaseLeftDays
  };
};