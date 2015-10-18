package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.state.StateManager;

public class GoToOptions implements Action {

  private StateManager state;

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
