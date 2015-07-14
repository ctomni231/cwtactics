package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface SupplyNeighbors extends SystemEvent {

  void onSupplyNeighbors(String supplier);
}
