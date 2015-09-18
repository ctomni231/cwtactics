package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.core.action.ActionManager;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;

public class IngameSelectFreeTileState extends AbstractIngameState {

  private UserInteractionData data;
  private ModelManager        model;
  private ActionManager       actions;

  @Override
  public void onEnter(StateTransition transition) {
    data.actionTarget.clean();
    actions.getAction(data.action).prepareSelection(data);
  }

  @Override
  public void handleButtonA(StateTransition transition, int delta) {
    if (actions.getAction(data.action).isTargetValid(data)) {
      data.actionTarget.set(model, data.cursorX, data.cursorY);
      transition.setTransitionTo("IngamePushActionState");
    }
  }
}
