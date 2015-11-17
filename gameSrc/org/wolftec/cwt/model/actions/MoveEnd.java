package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.controller.actions.core.ActionData;
import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.controller.actions.core.MoveMeta;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.gameround.GameroundEnder;

public class MoveEnd implements AbstractAction {

  private MoveLogic      move;
  private GameroundEnder   model;
  private MoveActionData moveDto;

  @Override
  public String key() {
    return "moveEnd";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.getAction().positionUpdateMode() == MoveMeta.PREVENT_CLEAR_OLD_POS ? 1 : 0;
    actionData.p2 = interactionData.getAction().positionUpdateMode() == MoveMeta.PREVENT_SET_NEW_POS ? 1 : 0;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    move.move(model.getUnit(moveDto.unitId), moveDto.x, moveDto.y, moveDto.movePath, false, data.p1 == 1, data.p2 == 1);

    // reset variables
    moveDto.unitId = Constants.INACTIVE;
    moveDto.x = Constants.INACTIVE;
    moveDto.y = Constants.INACTIVE;
  }

}
