package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface WeatherChanges extends SystemEvent {
  void onWeatherChanges(String weather, int duration);
}
