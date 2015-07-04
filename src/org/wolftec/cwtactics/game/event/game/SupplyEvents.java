package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.IEvent;

public interface SupplyEvents extends IEvent {

  default void onSupplyNeighbors(String supplier) {
  }
}
