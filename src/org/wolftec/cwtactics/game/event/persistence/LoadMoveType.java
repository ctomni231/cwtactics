package org.wolftec.cwtactics.game.event.persistence;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface LoadMoveType extends SystemEvent {
  void onLoadMoveType(String entity, Object data);
}
