package org.wolftec.cwtactics.game.event.game.capture;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface LoweredCapturePoints extends SystemEvent {
  void onLoweredCapturePoints(String property, int leftPoints);
}
