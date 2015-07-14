package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface HealUnit extends SystemEvent {
  void onHealUnit(String unit, int amount);
}
