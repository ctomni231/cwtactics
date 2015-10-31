package org.wolftec.cwt.logic.features;

import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.model.sheets.types.WeatherType;
import org.wolftec.cwt.system.Configurable;
import org.wolftec.cwt.system.Configuration;
import org.wolftec.cwt.system.ManagedClass;
import org.wolftec.cwt.util.NumberUtil;

public class WeatherLogic implements ManagedClass, Configurable {

  private SheetManager sheets;
  private ModelManager model;

  private Configuration cfgMinDays;
  private Configuration cfgRandomDays;

  @Override
  public void onConstruction() {
    cfgMinDays = new Configuration("weather.mindays", 1, 5, 1);
    cfgRandomDays = new Configuration("weather.randomdays", 0, 5, 4);
  }

  /**
   * 
   * 
   * @return random weather id in relation to the current action weather
   */
  public WeatherType pickRandomWeatherId(WeatherType current) {
    WeatherType defWather = sheets.weathers.filterFirst((key, weather) -> weather.defaultWeather);

    // Search a random weather if the last weather was `null` or the default
    // weather type
    WeatherType newTp;
    if (model.weather != null && model.weather == defWather) { // TODO
      newTp = sheets.weathers.random(model.weather);

    } else {
      // Take default weather and calculate a random amount of days
      newTp = defWather;
    }

    return newTp;
  }

  /**
   * @param type
   * @return random duration for a given weather type
   */
  public int pickRandomWeatherTime(WeatherType type) {
    WeatherType defWather = sheets.weathers.filterFirst((key, weather) -> weather.defaultWeather);

    return (type == defWather) ? 1 : (cfgMinDays.value + NumberUtil.asInt(cfgRandomDays.value * Math.random()));
  }

  /**
   * Changes the weather and sets the left days.
   * 
   * @param weather
   * @param duration
   */
  public void changeWeather(String weather, int duration) {
    model.weather = sheets.weathers.get(weather);
    model.weatherLeftDays = duration;
  }
}
