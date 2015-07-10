package org.wolftec.cwtactics.game.weather;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.DayStart;
import org.wolftec.cwtactics.game.event.LoadWeatherType;
import org.wolftec.cwtactics.game.event.SystemInitializedEvent;
import org.wolftec.cwtactics.game.event.WeatherChanges;

public class WeatherSystem implements System, DayStart, WeatherChanges, LoadWeatherType, SystemInitializedEvent {

  private Log                     log;
  private Asserter                asserter;

  private Components<Weather>     weathers;
  private Components<WeatherData> weathersData;

  @Override
  public void onSystemInitialized() {
    weathersData.acquire(Entities.GAME_ROUND);
  }

  @Override
  public void onLoadWeatherType(String entity, Object data) {
    Weather weather = weathers.acquireWithRootData(entity, data);
    asserter.inspectValue("Weather.defaultWeather of " + entity, weather.defaultWeather).isBoolean();
  }

  @Override
  public void onWeatherChanges(String weather, int duration) {
    WeatherData data = weathersData.get(Entities.GAME_ROUND);
    data.days = duration;
    data.weather = weather;
  }

  @Override
  public void onDayStart(int day) {
    WeatherData data = weathersData.get(Entities.GAME_ROUND);

    data.days--;
    if (data.days == 0) {
      log.info("changing weather..");

      String newWeatherName = weathers.getRandomEntity(JSCollections.$array(data.weather));
      Weather newWeather = weathers.get(newWeatherName);
      int newDuration = newWeather.defaultWeather ? 1 : generateRandomDuration();

      log.info("..to " + newWeatherName + " for " + newDuration + " days");
      // TODO action invocation
    }
  }

  private int generateRandomDuration() {
    return 1;
    // TODO return getCfgValue("weatherMinDays") +
    // NumberUtil.getRandomInt(getCfgValue("weatherRandomDays"));
  }
}
