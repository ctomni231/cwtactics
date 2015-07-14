package org.wolftec.cwtactics.game.event.loading;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface LoadCommanderType extends SystemEvent {
  void onLoadCommanderType(String entity, Object data);
}
