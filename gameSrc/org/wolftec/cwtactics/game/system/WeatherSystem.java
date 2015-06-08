package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.WeatherData;
import org.wolftec.cwtactics.game.components.Weather;
import org.wolftec.cwtactics.game.event.DayStartEvent;
import org.wolftec.cwtactics.game.event.WeatherChangesEvent;
import org.wolftec.cwtactics.game.util.NumberUtil;

public class WeatherSystem implements ISystem, DayStartEvent, WeatherChangesEvent {

  @Override
  public void onWeatherChanges(String weather, int duration) {
    WeatherData data = em().getNonNullComponent(EntityId.GAME_ROUND, WeatherData.class);
    data.days = duration;
    data.weather = weather;
  }

  @Override
  public void onDayStart(int day) {
    WeatherData data = em().getComponent(EntityId.GAME_ROUND, WeatherData.class);
    Weather currentWeather = em().getComponent(data.weather, Weather.class);

    data.days--;
    if (data.days == 0) {
      info("changing weather..");

      Array<String> weatherTypes = em().getEntitiesWithComponentType(Weather.class);
      String newWeatherEntity;

      while (true) {
        newWeatherEntity = weatherTypes.$get(NumberUtil.getRandomInt(weatherTypes.$length()));
        // TODO this looks very ugly :(
        if (newWeatherEntity != EntityId.GAME_ROUND && currentWeather != em().getComponent(newWeatherEntity, Weather.class)) {
          break;
        }
      }

      Weather newWeather = em().getComponent(newWeatherEntity, Weather.class);
      int newDuration = newWeather.defaultWeather ? 1 : generateRandomDuration();

      info("..to " + newWeatherEntity + " for " + newDuration + " days");
      // TODO action invocation
    }
  }

  private int generateRandomDuration() {
    return getCfgValue("weatherMinDays") + NumberUtil.getRandomInt(getCfgValue("weatherRandomDays"));
  }
}
