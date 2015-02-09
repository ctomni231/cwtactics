package org.wolfTec.cwt.game.gamelogic;

import org.stjs.javascript.JSGlobal;
import org.wolfTec.cwt.game.model.WeatherType;
import org.wolfTec.cwt.game.utility.ReadOnlyJsArray;

public interface WeatherLogic extends BaseLogic {

  default WeatherType getDefaultWeather() {
    ReadOnlyJsArray<WeatherType> types = getObjectTypes().getWeathers();
    for (int i = 0; i < types.$length(); i++) {
      if (types.$get(i).isDefaultWeather) {
        return types.$get(i);
      }
    }
    throw new IllegalStateException();
  }

  /**
   * Returns a random weather ID in relation to the current action weather.
   */
  default String generateWeatherId() {
    WeatherType newTp;

    // Search a random weather if the last weather was `null` or the default
    // weather type
    if (getGameRound().getWeather() != null && getGameRound().getWeather() == getDefaultWeather()) {
      newTp = selectRandom(getObjectTypes().getWeathers(), getGameRound().getWeather());

    } else {
      // Take default weather and calculate a random amount of days
      newTp = getDefaultWeather();
    }

    return newTp.ID;
  }

  /**
   * Picks a random duration for a given weather type.
   *
   * @param type
   * @return {number}
   */
  default int generateDuration(WeatherType type) {
    return (type == getDefaultWeather() ? 1 : (getGameConfig().getConfigValue("weatherMinDays") + JSGlobal.parseInt(
        getGameConfig().getConfigValue("weatherRandomDays") * Math.random(), 10)));
  }

  default void changeWeatherAction(WeatherType weather, int duration) {
    getGameRound().setWeather(weather);
    getGameRound().setWeatherLeftDays(duration);

    fog.fullRecalculation();
  }
}
