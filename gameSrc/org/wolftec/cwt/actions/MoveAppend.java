package org.wolftec.cwt.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.Action;
import org.wolftec.cwt.core.ActionData;
import org.wolftec.cwt.core.ActionType;
import org.wolftec.cwt.states.UserInteractionData;

public class MoveAppend implements Action {

  private MoveActionData moveDto;

  @Override
  public String key() {
    return "moveAppend";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
    // TODO
  }

  @Override
  public void evaluateByData(int delta, ActionData data) {
    if (data.p1 != Constants.INACTIVE) moveDto.movePath.push(data.p1);
    if (data.p2 != Constants.INACTIVE) moveDto.movePath.push(data.p2);
    if (data.p3 != Constants.INACTIVE) moveDto.movePath.push(data.p3);
    if (data.p4 != Constants.INACTIVE) moveDto.movePath.push(data.p4);
    if (data.p5 != Constants.INACTIVE) moveDto.movePath.push(data.p5);
  }
}
