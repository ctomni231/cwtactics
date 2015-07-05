package org.wolftec.cwtactics.game.event.persistence;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface LoadCommanderType extends SystemEvent {
  void onLoadCommanderType(String entity, Object data);
}
