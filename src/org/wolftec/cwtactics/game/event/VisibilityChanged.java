package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface VisibilityChanged extends SystemEvent {
  void onVisibilityChanged(int x, int y, boolean visible);
}
