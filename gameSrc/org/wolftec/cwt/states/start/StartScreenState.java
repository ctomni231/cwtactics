package org.wolftec.cwt.states.start;

import org.wolftec.cwt.core.env.Features;
import org.wolftec.cwt.core.input.InputProvider;
import org.wolftec.cwt.core.input.backends.KeyboardInput;
import org.wolftec.cwt.core.state.AbstractState;
import org.wolftec.cwt.core.state.GameActions;
import org.wolftec.cwt.core.state.StateFlowData;

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
