package org.wolftec.cwt.logic;

import org.wolftec.cwt.config.OptionsManager;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.sheets.WeatherType;
import org.wolftec.cwt.system.NumberUtil;

public class WeatherLogic implements Injectable {

  private OptionsManager  options;
  private SheetManager sheets;
  private ModelManager model;

  /**
   * Picks a random weather id in relation to the current action weather.
   * 
   * @return
   */
  public String pickRandomWeatherId() {
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

    return newTp.ID;
  }

  /**
   * Picks a random duration for a given weather type.
   */
  public int pickRandomWeatherTime(Object type) {
    WeatherType defWather = sheets.weathers.filterFirst((key, weather) -> weather.defaultWeather);

    return (type == defWather.ID) ? 1 : (options.weatherMinDays.value + NumberUtil.asInt(options.weatherRandomDays.value * Math.random()));
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
