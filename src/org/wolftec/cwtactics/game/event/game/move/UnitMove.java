package org.wolftec.cwtactics.game.event.game.move;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnitMove extends SystemEvent {
  void onUnitMove(String unit, Array<Integer> steps);
}
