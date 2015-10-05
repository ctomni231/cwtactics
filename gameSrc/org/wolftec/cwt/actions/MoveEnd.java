package org.wolftec.cwt.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.StateFlowData;

public class MoveEnd implements Action {

  private MoveLogic      move;
  private ModelManager   model;
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
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    move.move(model.getUnit(moveDto.unitId), moveDto.x, moveDto.y, moveDto.movePath, false, data.p1 == 1, data.p2 == 1);

    // reset variables
    moveDto.unitId = Constants.INACTIVE;
    moveDto.x = Constants.INACTIVE;
    moveDto.y = Constants.INACTIVE;
  }

}
