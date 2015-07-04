package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.IEvent;

public interface FogEvents extends IEvent {
  default void onTileVisionChanges(int x, int y, boolean visible) {

  }
}
