package org.wolftec.cwt.actions.gameactions;

import org.stjs.javascript.Array;
import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionType;

public class ActivatePower implements Action {

  @Override
  public String key() {
    return "activatePower";
  }

  @Override
  public ActionType type() {
    return ActionType.MAP_ACTION;
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
