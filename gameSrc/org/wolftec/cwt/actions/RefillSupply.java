package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.states.StateTransition;

public class RefillSupply implements Action {

  @Override
  public String key() {
    return "refillSupply";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateTransition stateTransition) {
    // TODO Auto-generated method stub

  }

}
