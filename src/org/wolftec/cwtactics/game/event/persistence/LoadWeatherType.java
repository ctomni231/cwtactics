package org.wolftec.cwtactics.game.event.persistence;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface LoadWeatherType extends SystemEvent {
  void onLoadWeatherType(String entity, Object data);
}
