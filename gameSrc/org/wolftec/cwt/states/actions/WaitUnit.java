package org.wolftec.cwt.states.actions;

import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionData;
import org.wolftec.cwt.actions.ActionType;
import org.wolftec.cwt.actions.UserInteractionData;
import org.wolftec.cwt.model.ModelManager;

public class WaitUnit implements Action {

  ModelManager model;

  @Override
  public String key() {
    return "wait";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return data.source.unit.canAct;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
    actionData.p1 = positionData.source.unitId;
  }

  @Override
  public void invoke(ActionData data) {
    model.getUnit(data.p1).setActable(false);
    // TODO renderer.renderUnitsOnScreen();
  }

}
