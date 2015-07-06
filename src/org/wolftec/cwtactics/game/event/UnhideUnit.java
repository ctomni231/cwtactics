package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface UnhideUnit extends SystemEvent {

  void onUnhideUnit(String unit);
}
