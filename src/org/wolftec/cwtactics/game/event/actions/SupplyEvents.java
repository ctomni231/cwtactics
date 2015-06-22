package org.wolftec.cwtactics.game.event.actions;

import org.wolftec.cwtactics.game.IEvent;

public interface SupplyEvents extends IEvent {

  default void onSupplyNeighbors(String supplier) {
  }
}
