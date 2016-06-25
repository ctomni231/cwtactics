// weather
cwt.baseWeather = cwt.immutable({
  defaultWeather: false,
  minDuration: 1,
  maxDuration: 4
});

// weather -> boolean
cwt.isWeather = (weather) => cwt.just(weather)
  .filter(w => cwt.isString(w.id) && w.id.length === 4)
  .filter(w => cwt.isInteger(w.minDuration) && w.minDuration >= 1)
  .filter(w => cwt.isInteger(w.maxDuration) && w.maxDuration >= w.minDuration)
  .filter(w => cwt.isBoolean(w.defaultWeather))
  .isPresent();

// ([map]) -> (() -> [weather])
cwt.loadWeathers = (data) => data
  .map(weather => cwt.flyweight(baseWeather, weather))
  .bind(data => data.map(weather => cwt.isWeather(weather) ? cwt.just(weather) : cwt.nothing()))
  .get();

// (weatherModel, weather) -> weatherModel
cwt.weatherModelFactory = (weatherModel, nextWeather) => {
  const day = Math.max(model.day - 1, 0);
  const type = model.day === 0 ? nextWeather : weatherModel.type;
  return {
    day, type
  };
};

cwt.getRandomWeatherModel = () =>
  random(0, weathers.length)
  .map(value => just(weatherModelFactory({}, weathers[value])))
  .get();

/*
let duration = active.minDuration;
    duration += parseInt(Math.random() * (active.maxDuration - duration), 10);
    leftDays = duration;
    */
