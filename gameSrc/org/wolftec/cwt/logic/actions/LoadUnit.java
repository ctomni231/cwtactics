package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.logic.features.TransportLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.wotec.action.Action;
import org.wolftec.cwt.wotec.action.ActionData;
import org.wolftec.cwt.wotec.action.ActionType;
import org.wolftec.cwt.wotec.action.PositionUpdateMode;
import org.wolftec.cwt.wotec.action.TileMeta;
import org.wolftec.cwt.wotec.state.StateFlowData;

public class LoadUnit implements Action {

  private ModelManager model;
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
  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag) {
    return unitFlag == TileMeta.OWN;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return transport.isTransportUnit(data.target.unit) && transport.canLoadUnit(data.target.unit, data.source.unit) && !transport.isFull(data.target.unit);
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
