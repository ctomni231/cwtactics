package org.wolftec.cwt.states.ingame.actions;

import org.wolftec.cwt.states.Action;
import org.wolftec.cwt.states.ActionData;
import org.wolftec.cwt.states.ActionType;

public class HealUnit implements Action {

  @Override
  public String key() {
    return "healUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void invoke(ActionData data) {
    // TODO Auto-generated method stub

  }

}
