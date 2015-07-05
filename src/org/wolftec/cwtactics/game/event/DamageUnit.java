package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface DamageUnit extends SystemEvent {
  void onDamageUnit(String unit, int amount, int rest);
}
