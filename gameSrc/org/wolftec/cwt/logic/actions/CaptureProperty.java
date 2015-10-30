package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.logic.features.CaptureLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.wTec.action.Action;
import org.wolftec.wTec.action.ActionData;
import org.wolftec.wTec.action.ActionType;
import org.wolftec.wTec.action.TileMeta;
import org.wolftec.wTec.state.StateFlowData;

public class CaptureProperty implements Action {

  private CaptureLogic capture;
  private ModelManager model;

  @Override
  public String key() {
    return "capture";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag) {
    return unitFlag == TileMeta.EMPTY && (propertyFlag == TileMeta.ENEMY || propertyFlag == TileMeta.NEUTRAL);
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return capture.canCapture(data.source.unit) && capture.canBeCaptured(data.target.property);
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
    actionData.p1 = positionData.target.propertyId;
    actionData.p2 = positionData.source.unitId;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    capture.captureProperty(model.getProperty(data.p1), model.getUnit(data.p2));
  }

}
