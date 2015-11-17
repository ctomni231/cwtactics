package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.controller.actions.core.ActionData;
import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.controller.actions.core.TileMeta;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.model.gameround.GameroundEnder;
import org.wolftec.cwt.model.tags.Configurable;
import org.wolftec.cwt.model.tags.TagValue;

public class CaptureProperty implements AbstractAction, Configurable {

  private GameroundEnder model;

  private TagValue cfgCapturerPoints;
  private TagValue cfgPropertyPoints;

  @Override
  public void onConstruction() {
    cfgPropertyPoints = new TagValue("game.capture.propertyPoints", 5, 99, 20);
    cfgCapturerPoints = new TagValue("game.capture.capturerPoints", 5, 99, 10);
  }

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
    return data.source.unit.canCapture() && data.target.property.canBeCaptured();
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
    actionData.p1 = positionData.target.propertyId;
    actionData.p2 = positionData.source.unitId;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    model.getProperty(data.p1).capturedBy(model.getUnit(data.p2), cfgCapturerPoints.value, cfgPropertyPoints.value);
  }

}
