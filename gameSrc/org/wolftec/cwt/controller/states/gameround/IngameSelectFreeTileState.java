package org.wolftec.cwt.controller.states.gameround;

import org.wolftec.cwt.action.ActionService;
import org.wolftec.cwt.controller.states.base.GameroundState;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.model.gameround.Battlefield;

public class IngameSelectFreeTileState extends GameroundState {

  private UserInteractionData data;
  private Battlefield model;
  private ActionService actions;

  @Override
  public void onEnter(StateFlowData transition) {
    data.actionTarget.clean();
    actions.getActionByKey(data.action).prepareSelection(data);
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta) {
    if (actions.getActionByKey(data.action).isTargetValid(data)) {
      model.updatePositionData(data.actionTarget, data.cursorX, data.cursorY);
      transition.setTransitionTo("IngamePushActionState");
    }
  }
}
