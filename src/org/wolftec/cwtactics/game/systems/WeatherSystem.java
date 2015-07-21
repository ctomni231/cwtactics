package org.wolftec.cwtactics.game.systems;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.game.components.Weather;
import org.wolftec.cwtactics.game.components.WeatherData;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.DayStart;
import org.wolftec.cwtactics.game.events.gameround.WeatherChanges;
import org.wolftec.cwtactics.game.events.system.SystemInitializedEvent;

public class WeatherSystem implements System, DayStart, WeatherChanges, SystemInitializedEvent {

  private Log                     log;

  private Components<Weather>     weathers;
  private Components<WeatherData> weathersData;

  @Override
  public void onSystemInitialized() {
    weathersData.acquire(Entities.GAME_ROUND);
  }

  @Override
  public void onWeatherChanges(String weather, int duration) {
    WeatherData data = weathersData.get(Entities.GAME_ROUND);
    data.leftDays = duration;
    data.weather = weather;
  }

  @Override
  public void onDayStart(int day) {
    WeatherData data = weathersData.get(Entities.GAME_ROUND);

    data.leftDays--;
    if (data.leftDays == 0) {
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
