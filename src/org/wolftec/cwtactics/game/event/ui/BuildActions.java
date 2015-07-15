package org.wolftec.cwtactics.game.event.ui;

import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface BuildActions extends SystemEvent {
  void buildActions(int x, int y, String tile, String property, String unit, BitSet flags);
}
