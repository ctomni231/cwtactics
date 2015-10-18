package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.states.UserInteractionData;

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
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.target.x;
    actionData.p2 = interactionData.target.y;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    // TODO Auto-generated method stub

  }

}
