package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.states.StateFlowData;

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
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    // TODO Auto-generated method stub

  }

}
