package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface DamageUnit extends SystemEvent {
  void onDamageUnit(String unit, int amount, int rest);
}
