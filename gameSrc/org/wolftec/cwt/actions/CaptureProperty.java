package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.action.PositionCheck;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.logic.CaptureLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

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
  public boolean checkTarget(PositionCheck unitFlag, PositionCheck propertyFlag) {
    return unitFlag == PositionCheck.EMPTY && (propertyFlag == PositionCheck.ENEMY || propertyFlag == PositionCheck.EMPTY);
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return NullUtil.isPresent(data.target.property) && capture.canCapture(data.source.unit) && capture.canBeCaptured(data.target.property);
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
