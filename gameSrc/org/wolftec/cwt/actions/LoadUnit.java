package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.action.PositionCheck;
import org.wolftec.cwt.core.action.PositionUpdateMode;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.logic.TransportLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
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
    return NullUtil.isPresent(data.target.unit) && transport.isTransportUnit(data.target.unit) && transport.canLoadUnit(data.target.unit, data.source.unit);
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
