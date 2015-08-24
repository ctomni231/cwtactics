package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.Action;
import org.wolftec.cwt.core.ActionData;
import org.wolftec.cwt.core.ActionType;
import org.wolftec.cwt.states.StateManager;

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
  public void evaluateByData(int delta, ActionData data) {
    // stateData.fromIngameToOptions = true;
    // state.changeState("MENU_OPTIONS");
  }

}
