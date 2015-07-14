package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface UnitProduced extends SystemEvent {

  void onUnitProduced(String unit, String type, int x, int y);
}
