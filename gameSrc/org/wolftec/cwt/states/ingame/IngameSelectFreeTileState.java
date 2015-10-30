package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.wTec.action.ActionManager;
import org.wolftec.wTec.state.AbstractIngameState;
import org.wolftec.wTec.state.StateFlowData;

public class IngameSelectFreeTileState extends AbstractIngameState {

  private UserInteractionData data;
  private ModelManager        model;
  private ActionManager       actions;

  @Override
  public void onEnter(StateFlowData transition) {
    data.actionTarget.clean();
    actions.getAction(data.action).prepareSelection(data);
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta) {
    if (actions.getAction(data.action).isTargetValid(data)) {
      data.actionTarget.set(model, data.cursorX, data.cursorY);
      transition.setTransitionTo("IngamePushActionState");
    }
  }
}
