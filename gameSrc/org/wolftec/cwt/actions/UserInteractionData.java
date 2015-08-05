package org.wolftec.cwt.actions;

import org.wolftec.cwt.logic.InformationList;
import org.wolftec.cwt.model.Player;
import org.wolftec.cwt.model.PositionData;
import org.wolftec.cwt.system.CircularBuffer;

public class UserInteractionData implements InformationList {

  public Player                  actor;

  public PositionData            source;
  public PositionData            target;
  public PositionData            actionTarget;

  public CircularBuffer<Integer> movePath;

  public String                  action;
  public int                     actionCode;

  public String                  actionData;
  public int                     actionDataCode;

  @Override
  public void addInfo(String key, boolean flag) {
    // TODO Auto-generated method stub

  }
}
