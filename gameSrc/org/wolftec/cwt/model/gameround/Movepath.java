package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.collection.RingList;

@Deprecated // merge into map movement
public class Movepath {

  private final RingList<Integer> movePath;

  public Movepath() {
    movePath = new RingList<Integer>(Constants.MAX_SELECTION_RANGE);
  }

  public boolean isEmpty() {
    return movePath.isEmpty();
  }

  public void flush() {
    while (!isEmpty()) {
      popCode();
    }
  }

  public void appendCode(int code) {
    movePath.push(code);
  }

  public int popCode() {
    return movePath.popLast();
  }
}
