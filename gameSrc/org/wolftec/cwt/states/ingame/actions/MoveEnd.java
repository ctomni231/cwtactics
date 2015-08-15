package org.wolftec.cwt.states.ingame.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.Action;
import org.wolftec.cwt.states.ActionData;
import org.wolftec.cwt.states.ActionType;

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
  public void invoke(ActionData data) {
    move.move(model.getUnit(moveDto.unitId), moveDto.x, moveDto.y, moveDto.movePath, false, data.p1 == 1, data.p2 == 1);

    // TODO
    // statemachine.changeState("ANIMATION_MOVE");
    // moveState.prepareMove(uid, x, y, moveBuffer);

    // reset variables
    moveDto.unitId = Constants.INACTIVE;
    moveDto.x = Constants.INACTIVE;
    moveDto.y = Constants.INACTIVE;
  }

}
