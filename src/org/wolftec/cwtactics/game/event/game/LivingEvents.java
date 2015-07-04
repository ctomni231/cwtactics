package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface LivingEvents extends SystemEvent {
  default void healUnit(String unit, int amount) {
  }

  default void onDamageUnit(String unit, int amount) {
  }
}
