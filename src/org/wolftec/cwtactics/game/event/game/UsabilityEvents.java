package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.IEvent;

public interface UsabilityEvents extends IEvent {

  default void onWait(String unit) {

  }

  default void onUnitGettingUnusable(String unit) {

  }

  default void onUnitGettingUsable(String unit) {

  }
}
