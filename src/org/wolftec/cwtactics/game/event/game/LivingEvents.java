package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.IEvent;

public interface LivingEvents extends IEvent {
  default void healUnit(String unit, int amount) {
  }

  default void onDamageUnit(String unit, int amount) {
  }
}
