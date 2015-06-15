package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface CaptureEvents extends IEvent {

  default void onLoweredCapturePoints(String capturer, String property, int leftPoints) {
  }

  default void onCapturedProperty(String capturer, String property) {
  }
}
