package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface FogEvents extends SystemEvent {
  default void onTileVisionChanges(int x, int y, boolean visible) {

  }
}
