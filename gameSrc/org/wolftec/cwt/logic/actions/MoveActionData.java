package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.system.ManagedClass;
import org.wolftec.cwt.system.RingList;

public class MoveActionData implements ManagedClass {
  public int                     x;
  public int                     y;
  public int                     unitId;
  public RingList<Integer> movePath;

  @Override
  public void onConstruction() {
    movePath = new RingList<Integer>(Constants.MAX_SELECTION_RANGE);
  }
}
