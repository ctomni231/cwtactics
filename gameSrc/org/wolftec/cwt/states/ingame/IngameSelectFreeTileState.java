package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.logic.ActionManager;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UserInteractionData;

public class IngameSelectFreeTileState extends AbstractIngameState {

  private UserInteractionData data;
  private ModelManager model;
  private ActionManager actions;

  @Override
  public void onEnter(StateFlowData transition) {
    data.actionTarget.clean();
    actions.getAction(data.action).prepareSelection(data);
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta) {
    if (actions.getAction(data.action).isTargetValid(data)) {
      model.updatePositionData(data.actionTarget, data.cursorX, data.cursorY);
      transition.setTransitionTo("IngamePushActionState");
    }
  }
}
