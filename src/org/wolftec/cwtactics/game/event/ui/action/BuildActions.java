package org.wolftec.cwtactics.game.event.ui.action;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.core.SystemEvent;

public interface BuildActions extends SystemEvent {
  default void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {

  }
}
