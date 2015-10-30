package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.wotec.action.Action;
import org.wolftec.cwt.wotec.action.ActionData;
import org.wolftec.cwt.wotec.action.ActionType;
import org.wolftec.cwt.wotec.state.StateFlowData;

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
    if (!positionData.movePath.isEmpty()) actionData.p1 = positionData.movePath.popFirst();
    if (!positionData.movePath.isEmpty()) actionData.p2 = positionData.movePath.popFirst();
    if (!positionData.movePath.isEmpty()) actionData.p3 = positionData.movePath.popFirst();
    if (!positionData.movePath.isEmpty()) actionData.p4 = positionData.movePath.popFirst();
    if (!positionData.movePath.isEmpty()) actionData.p5 = positionData.movePath.popFirst();
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    if (data.p1 != Constants.INACTIVE) moveDto.movePath.push(data.p1);
    if (data.p2 != Constants.INACTIVE) moveDto.movePath.push(data.p2);
    if (data.p3 != Constants.INACTIVE) moveDto.movePath.push(data.p3);
    if (data.p4 != Constants.INACTIVE) moveDto.movePath.push(data.p4);
    if (data.p5 != Constants.INACTIVE) moveDto.movePath.push(data.p5);
  }
}
