package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;

public class SupplyUnit implements Action {

  @Override
  public String key() {
    return "supplyUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public void evaluateByData(int delta, ActionData data) {
    // TODO Auto-generated method stub

  }
}
