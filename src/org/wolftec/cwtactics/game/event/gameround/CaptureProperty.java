package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface CaptureProperty extends SystemEvent {
  void onCaptureProperty(String capturer, String property);
}
