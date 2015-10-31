package org.wolftec.cwt.states.start;

import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.system.InputProvider;

public class StartScreenState extends AbstractState {

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    if (input.isActionPressed(GameActions.BUTTON_A)) {
      transition.setTransitionTo("MainMenuState");
    }
  }
}
