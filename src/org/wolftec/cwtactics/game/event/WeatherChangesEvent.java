package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface WeatherChangesEvent extends SystemEvent {
  void onWeatherChanges(String weather, int duration);
}
