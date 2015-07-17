package org.wolftec.cwtactics.game.events.loading;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface LoadMoveType extends SystemEvent {
  void onLoadMoveType(String entity, Object data);
}
