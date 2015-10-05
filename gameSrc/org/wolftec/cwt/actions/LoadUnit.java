package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.logic.TransportLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.PositionCheck;
import org.wolftec.cwt.states.PositionUpdateMode;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UserInteractionData;

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
    return data.target.unit.isPresent() && transport.isTransportUnit(data.target.unit.get())
        && transport.canLoadUnit(data.target.unit.get(), data.source.unit.get());
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.target.unitId;
    actionData.p2 = interactionData.source.unitId;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    transport.load(model.getUnit(data.p1), model.getUnit(data.p2));
  }
}
