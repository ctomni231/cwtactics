package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;

public class IngameSelectSelectionTileState extends AbstractIngameState {

  private UserInteractionData data;
  private ModelManager        model;

  @Override
  public void onEnter(StateTransition transition) {
    data.actionTarget.clean();
  }

  @Override
  public void onExit(StateTransition transition) {
    data.targets.reset();
  }

  @Override
  public void handleButtonA(StateTransition transition, int delta) {
    if (data.targets.getValue(data.cursorX, data.cursorY) >= 0) {
      data.actionTarget.set(model, data.cursorX, data.cursorY);
      transition.setTransitionTo("IngamePushActionState");
    }
  }
}
