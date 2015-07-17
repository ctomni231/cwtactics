package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface UnhideUnit extends SystemEvent {

  void onUnhideUnit(String unit);
}
