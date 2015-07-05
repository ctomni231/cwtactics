package org.wolftec.cwtactics.game.event.persistence;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface LoadTileType extends SystemEvent {
  void onLoadTileType(String entity, Object data);
}
