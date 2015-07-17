package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface UnitMoved extends SystemEvent {
  void onUnitMoved(String unit, int fromX, int fromY, int toX, int toY);
}
