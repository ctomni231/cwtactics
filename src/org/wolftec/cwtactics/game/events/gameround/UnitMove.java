package org.wolftec.cwtactics.game.events.gameround;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface UnitMove extends SystemEvent {
  void onUnitMove(String unit, Array<Integer> steps);
}
