package org.wolftec.cwtactics.game.event.features;

import org.wolftec.cwtactics.game.IEvent;

public interface FogEvents extends IEvent {
  default void onTileVisionChanges(int x, int y, boolean visible) {

  }
}
