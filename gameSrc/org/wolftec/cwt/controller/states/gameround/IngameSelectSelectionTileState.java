package org.wolftec.cwt.controller.states.gameround;

import org.wolftec.cwt.controller.states.base.GameroundState;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.model.gameround.Battlefield;

public class IngameSelectSelectionTileState extends GameroundState {

  private UserInteractionData data;
  private Battlefield model;

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
      model.updatePositionData(data.actionTarget, data.cursorX, data.cursorY);
      transition.setTransitionTo("IngamePushActionState");
    }
  }
}
