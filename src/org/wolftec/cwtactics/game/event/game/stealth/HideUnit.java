package org.wolftec.cwtactics.game.event.game.stealth;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface HideUnit extends SystemEvent {

  void onHideUnit(String unit);
}
