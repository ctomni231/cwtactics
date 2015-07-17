package org.wolftec.cwtactics.game.events.loading;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface LoadTileType extends SystemEvent {
  void onLoadTileType(String entity, Object data);
}
