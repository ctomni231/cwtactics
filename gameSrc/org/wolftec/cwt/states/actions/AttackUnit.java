package org.wolftec.cwt.states.actions;

import org.stjs.javascript.Array;
import org.wolftec.cwt.states.Action;
import org.wolftec.cwt.states.ActionType;

public class AttackUnit implements Action {

  @Override
  public String key() {
    return "attack";
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
