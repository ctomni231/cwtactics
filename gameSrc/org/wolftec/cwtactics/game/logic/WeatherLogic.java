package org.wolftec.cwtactics.game.logic;

import org.stjs.javascript.Array;
import org.wolftec.container.ContainerUtil;
import org.wolftec.core.ConvertUtility;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.cwtactics.game.domain.managers.GameConfigManager;
import org.wolftec.cwtactics.game.domain.managers.TypeManager;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.types.WeatherType;

@ManagedComponent
public class WeatherLogic {

  @Injected
  private TypeManager types;

  @Injected
  private GameManager gameround;

  @Injected
  private GameConfigManager config;

  @Injected
  private FogLogic fog;

  public WeatherType getpublicWeather() {
    Array<WeatherType> types = this.types.getWeathers();
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
    if (gameround.weather != null && gameround.weather == getpublicWeather()) {
      newTp = ContainerUtil.selectRandom(types.getWeathers(), gameround.weather);

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
