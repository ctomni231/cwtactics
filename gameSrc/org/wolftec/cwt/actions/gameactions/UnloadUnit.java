package org.wolftec.cwt.actions.gameactions;

import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionData;
import org.wolftec.cwt.actions.ActionType;

public class UnloadUnit implements Action {

  private @Override public String key() {
    return "unloadUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public void invoke(ActionData data) {
    // TODO Auto-generated method stub

  }

}
