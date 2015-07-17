package org.wolftec.cwtactics.game.events.loading;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface LoadWeatherType extends SystemEvent {
  void onLoadWeatherType(String entity, Object data);
}
