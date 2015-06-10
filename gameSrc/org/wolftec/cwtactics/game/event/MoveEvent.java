package org.wolftec.cwtactics.game.event;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.IEvent;

public interface MoveEvent extends IEvent {
  default void onUnitMove(String unit, Array<Integer> steps) {
  }

  default void onUnitMoved(String unit, int fromX, int fromY, int toX, int toY) {
  }
}
