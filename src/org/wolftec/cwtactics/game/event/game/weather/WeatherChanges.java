package org.wolftec.cwtactics.game.event.game.weather;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface WeatherChanges extends SystemEvent {
  void onWeatherChanges(String weather, int duration);
}
