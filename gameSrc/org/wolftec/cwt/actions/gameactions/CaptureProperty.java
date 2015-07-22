package org.wolftec.cwt.actions.gameactions;

import org.stjs.javascript.Array;
import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionType;

public class CaptureProperty implements Action {

  @Override
  public String key() {
    return "capture";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public void action() {
    // TODO Auto-generated method stub

  }

  @Override
  public boolean condition() {
    // TODO Auto-generated method stub
    return false;
  }

  @Override
  public Array<Integer> relationToProp() {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public void invoke() {
    // TODO Auto-generated method stub

  }

}
