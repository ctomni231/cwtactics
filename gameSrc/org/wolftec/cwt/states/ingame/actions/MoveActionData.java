package org.wolftec.cwt.states.ingame.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.CircularBuffer;

public class MoveActionData implements Injectable {
  public int                     x;
  public int                     y;
  public int                     unitId;
  public CircularBuffer<Integer> movePath;

  @Override
  public void onConstruction() {
    movePath = new CircularBuffer<Integer>(Constants.MAX_SELECTION_RANGE);
  }
}
