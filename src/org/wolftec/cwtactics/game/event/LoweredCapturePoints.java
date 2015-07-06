package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface LoweredCapturePoints extends SystemEvent {
  void onLoweredCapturePoints(String property, int leftPoints);
}
