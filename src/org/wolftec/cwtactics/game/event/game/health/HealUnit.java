package org.wolftec.cwtactics.game.event.game.health;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface HealUnit extends SystemEvent {
  void onHealUnit(String unit, int amount);
}
