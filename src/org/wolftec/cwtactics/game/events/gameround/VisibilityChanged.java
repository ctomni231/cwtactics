package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface VisibilityChanged extends SystemEvent {
  void onVisibilityChanged(int x, int y, boolean visible);
}
