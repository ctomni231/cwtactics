package org.wolftec.cwtactics.game.event.game.fog;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface VisibilityChanged extends SystemEvent {
  void onVisibilityChanged(int x, int y, boolean visible);
}
