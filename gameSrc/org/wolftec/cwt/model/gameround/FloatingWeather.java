package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.NumberUtil;
import org.wolftec.cwt.model.gameround.objecttypes.WeatherType;
import org.wolftec.cwt.model.sheets.SheetSet;

public class FloatingWeather {

  /**
   * The active weather type object.
   */
  private WeatherType type;

  /**
   * The amount of days until the weather will be changed.
   */
  private int leftDays;

  public FloatingWeather() {
  }

  public WeatherType getType() {
    return type;
  }

  public int getLeftDays() {
    return leftDays;
  }

  public void decreaseLeftDays() {
    AssertUtil.assertThat(leftDays > 0);
    leftDays--;
  }

  /**
   * 
   * 
   * @return random weather id in relation to the current action weather
   */
  public String pickRandomWeatherId(SheetSet<WeatherType> weathers) {
    WeatherType defWather = weathers.filterFirst((key, weather) -> weather.defaultWeather);

    // Search a random weather if the last weather was `null` or the default
    // weather type
    WeatherType newTp;
    if (type == defWather) {
      newTp = weathers.random(type);

    } else {
      // Take default weather and calculate a random amount of days
      newTp = defWather;
    }

    return newTp.ID;
  }

  public int pickRandomWeatherTime(WeatherType type, int minDays, int additionalRandomDays) {
    return (type.defaultWeather ? 1 : (minDays + NumberUtil.asInt(additionalRandomDays * Math.random())));
  }

  public void changeWeather(WeatherType type, int duration) {
    this.type = type;
    this.leftDays = duration;
  }
}
