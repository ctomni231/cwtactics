package org.wolftec.cwtactics.game.event.actions;

import org.wolftec.cwtactics.game.IEvent;

public interface CaptureEvents extends IEvent {
  default void onCaptureProperty(String capturer, String property) {
  }

  default void onLoweredCapturePoints(String property, int leftPoints) {
  }

  default void onCapturedProperty(String property, String newOwner, String oldOwner) {

  }
}
