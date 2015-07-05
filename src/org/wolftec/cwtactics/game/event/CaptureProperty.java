package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface CaptureProperty extends SystemEvent {
  void onCaptureProperty(String capturer, String property);
}
