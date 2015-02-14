package org.wolfTec.cwt.game.gamelogic;

import org.wolfTec.cwt.game.model.GameConfigBean;
import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.types.ObjectTypesBean;
import org.wolfTec.cwt.game.model.types.WeatherType;
import org.wolfTec.cwt.utility.ConvertUtility;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;
import org.wolfTec.cwt.utility.container.ImmutableArray;
import org.wolfTec.cwt.utility.container.ListUtil;

@Bean
public class WeatherLogic {

  @Injected
  private ObjectTypesBean types;

  @Injected
  private GameRoundBean gameround;

  @Injected
  private GameConfigBean config;

  @Injected
  private FogLogic fog;

  public WeatherType getpublicWeather() {
    ImmutableArray<WeatherType> types = this.types.getWeathers();
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
  public String generateWeatherId() {
    WeatherType newTp;

    // Search a random weather if the last weather was `null` or the public
    // weather type
    if (gameround.getWeather() != null && gameround.getWeather() == getpublicWeather()) {
      newTp = ListUtil.selectRandom(types.getWeathers(), gameround.getWeather());

    } else {
      // Take public weather and calculate a random amount of days
      newTp = getpublicWeather();
    }

    return newTp.ID;
  }

  /**
   * Picks a random duration for a given weather type.
   *
   * @param type
   * @return {number}
   */
  public int generateDuration(WeatherType type) {
    if (type == getpublicWeather()) {
      return 1;
    } else {
      return config.getConfigValue("weatherMinDays")
          + ConvertUtility.floatToInt(config.getConfigValue("weatherRandomDays") * Math.random());
    }
  }

  public void changeWeatherAction(WeatherType weather, int duration) {
    gameround.setWeather(weather);
    gameround.setWeatherLeftDays(duration);

    fog.fullRecalculation();
  }
}
