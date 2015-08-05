package org.wolftec.cwt.actions.gameactions;

import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionData;
import org.wolftec.cwt.actions.ActionType;
import org.wolftec.cwt.actions.UserInteractionData;

public class MoveStart implements Action {

  private MoveActionData moveDto;

  @Override
  public String key() {
    return "moveStart";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
    actionData.p1 = positionData.source.unitId;
    actionData.p2 = positionData.source.x;
    actionData.p3 = positionData.source.y;
  }

  @Override
  public void invoke(ActionData data) {
    moveDto.movePath.clear();
    moveDto.unitId = data.p1;
    moveDto.x = data.p2;
    moveDto.y = data.p3;
  }
}
