package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.wTec.state.AbstractIngameState;
import org.wolftec.wTec.state.StateFlowData;

public class IngameSelectSelectionTileState extends AbstractIngameState {

  private UserInteractionData data;
  private ModelManager        model;

  @Override
  public void onEnter(StateFlowData transition) {
    data.actionTarget.clean();
  }

  @Override
  public void onExit(StateFlowData transition) {
    data.targets.reset();
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta) {
    if (data.targets.getValue(data.cursorX, data.cursorY) >= 0) {
      data.actionTarget.set(model, data.cursorX, data.cursorY);
      transition.setTransitionTo("IngamePushActionState");
    }
  }
}
