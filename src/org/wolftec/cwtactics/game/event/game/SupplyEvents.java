package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface SupplyEvents extends SystemEvent {

  default void onSupplyNeighbors(String supplier) {
  }
}
