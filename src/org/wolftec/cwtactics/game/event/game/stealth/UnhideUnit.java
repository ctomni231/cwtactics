package org.wolftec.cwtactics.game.event.game.stealth;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnhideUnit extends SystemEvent {

  void onUnhideUnit(String unit);
}
