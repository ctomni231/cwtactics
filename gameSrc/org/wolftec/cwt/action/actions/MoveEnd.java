package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.action.MoveMeta;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;

public class MoveEnd implements Action
{

  private MoveLogic move;
  private ModelManager model;
  private MoveActionData moveDto;

  @Override
  public String key()
  {
    return "moveEnd";
  }

  @Override
  public ActionType type()
  {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData)
  {
    actionData.p1 = interactionData.getAction().positionUpdateMode() == MoveMeta.PREVENT_CLEAR_OLD_POS ? 1 : 0;
    actionData.p2 = interactionData.getAction().positionUpdateMode() == MoveMeta.PREVENT_SET_NEW_POS ? 1 : 0;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    move.move(model.getUnit(moveDto.unitId), moveDto.x, moveDto.y, moveDto.movePath, false, data.p1 == 1, data.p2 == 1);

    // reset variables
    moveDto.unitId = Constants.INACTIVE;
    moveDto.x = Constants.INACTIVE;
    moveDto.y = Constants.INACTIVE;
  }

}
