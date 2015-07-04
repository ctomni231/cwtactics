package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface HealthEvents extends SystemEvent {
  default void onDamageUnit(String unit, int amount, int rest) {
  }

  default void onHealUnit(String unit, int amount) {
  }
}
