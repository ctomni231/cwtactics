package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.IEvent;

public interface NextFrameEvent extends IEvent {
  void onNextFrame(int delta);
}
