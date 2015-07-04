package org.wolftec.cwtactics.game.event.game.factory;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnitProduced extends SystemEvent {

  void onUnitProduced(String unit, String type, int x, int y);
}
