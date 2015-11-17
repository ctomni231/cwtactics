package org.wolftec.cwt.controller.states.start;

import org.wolftec.cwt.controller.states.base.State;
import org.wolftec.cwt.controller.states.base.GameActionConstants;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.view.input.InputService;

public class StartScreenState extends State {

  @Override
  public void update(StateFlowData transition, int delta, InputService input) {
    if (input.isActionPressed(GameActionConstants.BUTTON_A)) {
      transition.setTransitionTo("MainMenuState");
    }
  }
}
