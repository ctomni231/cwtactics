package org.wolftec.cwtactics.game.event.game.move;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnitMoved extends SystemEvent {
  void onUnitMoved(String unit, int fromX, int fromY, int toX, int toY);
}
