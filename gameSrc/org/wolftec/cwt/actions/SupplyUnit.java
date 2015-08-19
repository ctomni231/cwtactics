package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.Action;
import org.wolftec.cwt.core.ActionData;
import org.wolftec.cwt.core.ActionType;

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
  public void invoke(ActionData data) {
    // TODO Auto-generated method stub

  }
}
