package org.wolftec.cwt.states.actions;

import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionData;
import org.wolftec.cwt.actions.ActionType;
import org.wolftec.cwt.actions.PositionCheck;
import org.wolftec.cwt.actions.PositionUpdateMode;
import org.wolftec.cwt.actions.UserInteractionData;
import org.wolftec.cwt.logic.TransportLogic;
import org.wolftec.cwt.model.ModelManager;

public class LoadUnit implements Action {

  private ModelManager   model;
  private TransportLogic transport;

  @Override
  public String key() {
    return "loadUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public PositionUpdateMode positionUpdateMode() {
    return PositionUpdateMode.PREVENT_SET_NEW_POS;
  }

  @Override
  public boolean checkTarget(PositionCheck unitFlag, PositionCheck propertyFlag) {
    return unitFlag == PositionCheck.OWN;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return transport.isTransportUnit(data.target.unit) && transport.canLoadUnit(data.target.unit, data.source.unit);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.target.unitId;
    actionData.p2 = interactionData.source.unitId;
  }

  @Override
  public void invoke(ActionData data) {
    transport.load(model.getUnit(data.p1), model.getUnit(data.p2));
  }
}
