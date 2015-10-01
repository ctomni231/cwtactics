package org.wolftec.cwt.states.start;

import org.wolftec.cwt.input.InputProvider;
import org.wolftec.cwt.input.backends.KeyboardInput;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.system.Features;

public class StartScreenState extends AbstractState {

  private Features      features;
  private KeyboardInput keyboard;

  @Override
  public void update(StateTransition transition, int delta, InputProvider input) {
    if (input.isActionPressed(GameActions.BUTTON_A)) {

      transition.setTransitionTo("MainMenuState");
    }
  }
}
