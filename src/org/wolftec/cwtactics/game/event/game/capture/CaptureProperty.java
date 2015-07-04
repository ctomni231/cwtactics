package org.wolftec.cwtactics.game.event.game.capture;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface CaptureProperty extends SystemEvent {
  void onCaptureProperty(String capturer, String property);
}
