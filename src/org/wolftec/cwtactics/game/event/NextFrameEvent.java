package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface NextFrameEvent extends SystemEvent {
  void onNextFrame(int delta);
}
