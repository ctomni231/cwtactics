package org.wolftec.cwtactics.game.event.system;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface FrameTick extends SystemEvent {
  void onNextTick(int delta);
}
