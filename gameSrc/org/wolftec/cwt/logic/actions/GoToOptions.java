package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.wotec.action.Action;
import org.wolftec.cwt.wotec.action.ActionData;
import org.wolftec.cwt.wotec.action.ActionType;
import org.wolftec.cwt.wotec.state.StateFlowData;

public class GoToOptions implements Action {

  @Override
  public String key() {
    return "options";
  }

  @Override
  public ActionType type() {
    return ActionType.MAP_ACTION;
  }

  @Override
  public boolean noAutoWait() {
    return true;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    stateTransition.setTransitionTo("IngameOptionsMenuState");
  }

}
