package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UsabilityEvents extends SystemEvent {

  default void onWait(String unit) {

  }

  default void onUnitGettingUnusable(String unit) {

  }

  default void onUnitGettingUsable(String unit) {

  }
}
