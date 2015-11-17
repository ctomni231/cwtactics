package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.controller.actions.core.ActionData;
import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.controller.actions.core.MoveMeta;
import org.wolftec.cwt.controller.actions.core.TileMeta;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.logic.TransportLogic;
import org.wolftec.cwt.model.gameround.GameroundEnder;

public class LoadUnit implements AbstractAction {

  private GameroundEnder model;
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
  public MoveMeta positionUpdateMode() {
    return MoveMeta.PREVENT_SET_NEW_POS;
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
