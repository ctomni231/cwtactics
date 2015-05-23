package org.wolftec.cwtactics.game.system.logic;

import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.components.data.WeatherCmp;
import org.wolftec.cwtactics.game.components.objects.WeatherDurationCmp;
import org.wolftec.cwtactics.game.system.ISystem;

public class WeatherSys implements ISystem {

  @Override
  public void onInit() {
    events().WEATHER_CHANGES.subscribe((weather, days) -> changeWeather(weather, days));
  }

  private void changeWeather(String weather, int duration) {
    getEntityComponent(EntityId.GAME_ROUND, WeatherDurationCmp.class).days = duration;

    entityManager().detachEntityComponent(EntityId.GAME_ROUND, WeatherCmp.class);
    entityManager().attachEntityComponent(EntityId.GAME_ROUND, getEntityComponent(weather, WeatherCmp.class));

    events().WEATHER_CHANGED.publish(weather);
  }
}
