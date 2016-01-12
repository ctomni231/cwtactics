package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.action.TileMeta;
import org.wolftec.cwt.logic.CaptureLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;

public class CaptureProperty implements Action
{

  private CaptureLogic capture;
  private ModelManager model;

  @Override
  public String key()
  {
    return "capture";
  }

  @Override
  public ActionType type()
  {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag)
  {
    return unitFlag == TileMeta.EMPTY && (propertyFlag == TileMeta.ENEMY || propertyFlag == TileMeta.NEUTRAL);
  }

  @Override
  public boolean condition(UserInteractionData data)
  {
    return capture.canCapture(data.source.unit) && capture.canBeCaptured(data.target.property);
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData)
  {
    actionData.p1 = positionData.target.propertyId;
    actionData.p2 = positionData.source.unitId;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    capture.captureProperty(model.getProperty(data.p1), model.getUnit(data.p2));
  }

}
