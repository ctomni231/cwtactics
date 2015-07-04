package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.Weather;
import org.wolftec.cwtactics.game.components.game.WeatherData;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.WeatherChangesEvent;
import org.wolftec.cwtactics.game.event.game.TurnEvents;
import org.wolftec.cwtactics.game.util.NumberUtil;

public class WeatherSystem implements ConstructedClass, TurnEvents, WeatherChangesEvent, LoadEntityEvent {

  private Log log;
  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
    log.info("created");
  }

  @Override
  public void onLoadWeatherTypeEntity(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Weather.class, (weather) -> {
      asserter.inspectValue("Weather.defaultWeather of " + entity, weather.defaultWeather).isBoolean();
    });
  }

  @Override
  public void onWeatherChanges(String weather, int duration) {
    WeatherData data = em.getNonNullComponent(EntityId.GAME_ROUND, WeatherData.class);
    data.days = duration;
    data.weather = weather;
  }

  @Override
  public void onDayStart(int day) {
    WeatherData data = em.getComponent(EntityId.GAME_ROUND, WeatherData.class);
    Weather currentWeather = em.getComponent(data.weather, Weather.class);

    data.days--;
    if (data.days == 0) {
      log.info("changing weather..");

      Array<String> weatherTypes = em.getEntitiesWithComponentType(Weather.class);
      String newWeatherEntity;

      while (true) {
        newWeatherEntity = weatherTypes.$get(NumberUtil.getRandomInt(weatherTypes.$length()));
        // TODO this looks very ugly :(
        if (newWeatherEntity != EntityId.GAME_ROUND && currentWeather != em.getComponent(newWeatherEntity, Weather.class)) {
          break;
        }
      }

      Weather newWeather = em.getComponent(newWeatherEntity, Weather.class);
      int newDuration = newWeather.defaultWeather ? 1 : generateRandomDuration();

      log.info("..to " + newWeatherEntity + " for " + newDuration + " days");
      // TODO action invocation
    }
  }

  private int generateRandomDuration() {
    return 1;
    // TODO return getCfgValue("weatherMinDays") +
    // NumberUtil.getRandomInt(getCfgValue("weatherRandomDays"));
  }
}
