package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.IEvent;

public interface WeatherChangesEvent extends IEvent {
  void onWeatherChanges(String weather, int duration);
}
