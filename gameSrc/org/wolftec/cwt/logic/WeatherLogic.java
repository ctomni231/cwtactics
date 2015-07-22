package org.wolftec.cwt.logic;

import org.wolftec.cwt.GameOptions;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.sheets.SheetManager;
import org.wolftec.cwt.system.NumberUtil;

public class WeatherLogic implements Injectable {

  private SheetManager sheets;
  private ModelManager model;

  /**
   * Picks a random weather id in relation to the current action weather.
   * 
   * @return
   */
  public String pickRandomWeatherId() {

    // Search a random weather if the last weather was `null` or the default
    // weather type
    var newTp;
    if (model.weather && model.weather == sheets.defaultWeather) {
      var list = sheets.weathers.types;
      newTp = selectRandom(list, model.weather.ID);

    } else {
      // Take default weather and calculate a random amount of days
      newTp = sheets.defaultWeather;
    }

    return newTp.ID;
  }

  /**
   * Picks a random duration for a given weather type.
   */
  public int pickRandomWeatherTime(Object type) {
    return (type == sheets.defaultWeather.ID) ? 1 : (GameOptions.weatherMinDays.value + NumberUtil.asInt(GameOptions.weatherRandomDays.value * Math.random()));
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
