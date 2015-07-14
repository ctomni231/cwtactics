package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface UnhideUnit extends SystemEvent {

  void onUnhideUnit(String unit);
}
