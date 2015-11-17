package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.controller.actions.core.ActionData;
import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.core.collection.RingList;

public class MoveStart implements AbstractAction {

  public static class MoveActionData {
    public int x;
    public int y;
    public int unitId;
    public RingList<Integer> movePath;

    public MoveActionData() {
      movePath = new RingList<Integer>(Constants.MAX_SELECTION_RANGE);
    }
  }

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
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    moveDto.movePath.clear();
    moveDto.unitId = data.p1;
    moveDto.x = data.p2;
    moveDto.y = data.p3;
  }
}
