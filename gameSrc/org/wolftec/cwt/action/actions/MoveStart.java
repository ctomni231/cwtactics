package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;

public class MoveStart implements Action
{

  private MoveActionData moveDto;

  @Override
  public String key()
  {
    return "moveStart";
  }

  @Override
  public ActionType type()
  {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData)
  {
    actionData.p1 = positionData.source.unitId;
    actionData.p2 = positionData.source.x;
    actionData.p3 = positionData.source.y;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    moveDto.movePath.clear();
    moveDto.unitId = data.p1;
    moveDto.x = data.p2;
    moveDto.y = data.p3;
  }
}
