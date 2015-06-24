package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.IEvent;

public interface HealthEvents extends IEvent {
  default void onDamageUnit(String unit, int amount, int rest) {
  }

  default void onHealUnit(String unit, int amount) {
  }
}
