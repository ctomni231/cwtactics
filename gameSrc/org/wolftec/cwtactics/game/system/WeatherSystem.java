package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.WeatherComponent;
import org.wolftec.cwtactics.game.components.WeatherDataComponent;
import org.wolftec.cwtactics.game.event.DayStartEvent;
import org.wolftec.cwtactics.game.event.WeatherChangesEvent;
import org.wolftec.cwtactics.game.util.NumberUtil;

public class WeatherSystem implements ISystem, DayStartEvent, WeatherChangesEvent {

  @Override
  public void onWeatherChanges(String weather, int duration) {
    gogec(EntityId.GAME_ROUND, WeatherComponent.class).days = duration;
    datec(EntityId.GAME_ROUND, WeatherDataComponent.class);
    atec(EntityId.GAME_ROUND, gec(weather, WeatherDataComponent.class));
  }

  @Override
  public void onDayStart(int day) {
    WeatherComponent data = gec(EntityId.GAME_ROUND, WeatherComponent.class);
    WeatherDataComponent currentWeather = gec(EntityId.GAME_ROUND, WeatherDataComponent.class);

    data.days--;
    if (data.days == 0) {
      info("changing weather..");

      Array<String> weatherTypes = em().getEntitiesWithComponentType(WeatherDataComponent.class);
      String newWeatherEntity;

      while (true) {
        newWeatherEntity = weatherTypes.$get(NumberUtil.getRandomInt(weatherTypes.$length()));
        // TODO this looks very ugly :(
        if (newWeatherEntity != EntityId.GAME_ROUND && currentWeather != em().getComponent(newWeatherEntity, WeatherDataComponent.class)) {
          break;
        }
      }

      WeatherDataComponent newWeather = gec(newWeatherEntity, WeatherDataComponent.class);
      int newDuration = newWeather.defaultWeather ? 1 : generateRandomDuration();

      info("..to " + newWeatherEntity + " for " + newDuration + " days");
      // TODO action invocation
    }
  }

  private int generateRandomDuration() {
    return getCfgValue("weatherMinDays") + NumberUtil.getRandomInt(getCfgValue("weatherRandomDays"));
  }
}
