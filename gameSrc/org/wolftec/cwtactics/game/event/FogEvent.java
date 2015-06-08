package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface FogEvent extends IEvent {
  void onTileVisionChanges(int x, int y, boolean visible);
}
