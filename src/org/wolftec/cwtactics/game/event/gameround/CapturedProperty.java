package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface CapturedProperty extends SystemEvent {
  void onCapturedProperty(String capturer, String newOwner, String property);
}
