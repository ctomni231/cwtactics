package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;

public class MoveAppend implements Action
{

  private MoveActionData moveDto;

  @Override
  public String key()
  {
    return "moveAppend";
  }

  @Override
  public ActionType type()
  {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData)
  {
    if (!positionData.movePath.isEmpty())
      actionData.p1 = positionData.movePath.popFirst();
    if (!positionData.movePath.isEmpty())
      actionData.p2 = positionData.movePath.popFirst();
    if (!positionData.movePath.isEmpty())
      actionData.p3 = positionData.movePath.popFirst();
    if (!positionData.movePath.isEmpty())
      actionData.p4 = positionData.movePath.popFirst();
    if (!positionData.movePath.isEmpty())
      actionData.p5 = positionData.movePath.popFirst();
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    if (data.p1 != Constants.INACTIVE)
      moveDto.movePath.push(data.p1);
    if (data.p2 != Constants.INACTIVE)
      moveDto.movePath.push(data.p2);
    if (data.p3 != Constants.INACTIVE)
      moveDto.movePath.push(data.p3);
    if (data.p4 != Constants.INACTIVE)
      moveDto.movePath.push(data.p4);
    if (data.p5 != Constants.INACTIVE)
      moveDto.movePath.push(data.p5);
  }
}
