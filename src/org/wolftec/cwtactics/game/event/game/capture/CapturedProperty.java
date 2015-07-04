package org.wolftec.cwtactics.game.event.game.capture;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface CapturedProperty extends SystemEvent {
  void onCapturedProperty(String capturer, String newOwner, String property);
}
