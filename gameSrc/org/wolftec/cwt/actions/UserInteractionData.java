package org.wolftec.cwt.actions;

import org.wolftec.cwt.model.PositionData;

public class UserInteractionData {
  public PositionData            source;
  public PositionData            target;
  public PositionData            actionTarget;
  public CircularBuffer<Integer> movePath;
}
