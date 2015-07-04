package org.wolftec.cwtactics.game.event.game.supply;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface SupplyNeighbors extends SystemEvent {

  void onSupplyNeighbors(String supplier);
}
