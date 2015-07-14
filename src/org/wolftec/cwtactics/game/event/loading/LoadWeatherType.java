package org.wolftec.cwtactics.game.event.loading;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface LoadWeatherType extends SystemEvent {
  void onLoadWeatherType(String entity, Object data);
}
