package org.wolftec.cwt.states.start;

import org.wolftec.wTec.env.Features;
import org.wolftec.wTec.input.InputProvider;
import org.wolftec.wTec.input.backends.KeyboardInput;
import org.wolftec.wTec.state.AbstractState;
import org.wolftec.wTec.state.GameActions;
import org.wolftec.wTec.state.StateFlowData;

public class StartScreenState extends AbstractState {

  private Features      features;
  private KeyboardInput keyboard;

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    if (input.isActionPressed(GameActions.BUTTON_A)) {

      transition.setTransitionTo("MainMenuState");
    }
  }
}
