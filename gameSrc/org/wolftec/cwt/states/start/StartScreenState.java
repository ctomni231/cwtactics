package org.wolftec.cwt.states.start;

import org.wolftec.cwt.input.InputService;
import org.wolftec.cwt.states.base.AbstractState;
import org.wolftec.cwt.states.base.GameActions;
import org.wolftec.cwt.states.base.StateFlowData;

public class StartScreenState extends AbstractState {

  @Override
  public void update(StateFlowData transition, int delta, InputService input) {
    if (input.isActionPressed(GameActions.BUTTON_A)) {
      transition.setTransitionTo("MainMenuState");
    }
  }
}
