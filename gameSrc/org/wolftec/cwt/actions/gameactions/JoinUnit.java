package org.wolftec.cwt.actions.gameactions;

import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionData;
import org.wolftec.cwt.actions.ActionType;
import org.wolftec.cwt.actions.PositionCheck;
import org.wolftec.cwt.actions.UserInteractionData;
import org.wolftec.cwt.logic.JoinLogic;
import org.wolftec.cwt.model.ModelManager;

public class JoinUnit implements Action {

  private JoinLogic    join;
  private ModelManager model;

  @Override
  public String key() {
    return "joinUnits";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean noAutoWait() {
    return false;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
    actionData.p1 = positionData.source.unitId;
    actionData.p2 = positionData.target.x;
    actionData.p3 = positionData.target.y;
  }

  @Override
  public boolean checkTarget(PositionCheck unitFlag, PositionCheck propertyFlag) {
    return unitFlag == PositionCheck.OWN;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return join.canJoin(data.source.unit, data.target.unit);
  }

  @Override
  public void invoke(ActionData data) {
    join.join(model.getUnit(data.p1), data.p2, data.p3);
  }

}
