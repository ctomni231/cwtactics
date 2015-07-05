package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface SupplyNeighbors extends SystemEvent {

  void onSupplyNeighbors(String supplier);
}
