package org.wolftec.cwt.states.actions;

import org.wolftec.cwt.states.Action;
import org.wolftec.cwt.states.ActionData;
import org.wolftec.cwt.states.ActionType;
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
  public void invoke(ActionData data) {
    // stateData.fromIngameToOptions = true;
    state.changeState("MENU_OPTIONS");
  }

}
