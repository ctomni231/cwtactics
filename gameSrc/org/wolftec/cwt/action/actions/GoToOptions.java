package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.states.base.StateFlowData;

public class GoToOptions implements Action
{

  @Override
  public String key()
  {
    return "options";
  }

  @Override
  public ActionType type()
  {
    return ActionType.MAP_ACTION;
  }

  @Override
  public boolean noAutoWait()
  {
    return true;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    stateTransition.setTransitionTo("IngameOptionsMenuState");
  }

}
