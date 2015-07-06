package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface LoadWeatherType extends SystemEvent {
  void onLoadWeatherType(String entity, Object data);
}
