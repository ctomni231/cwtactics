package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface SupplyNeighbors extends SystemEvent {

  void onSupplyNeighbors(String supplier);
}
