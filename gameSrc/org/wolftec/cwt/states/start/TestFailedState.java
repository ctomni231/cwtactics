package org.wolftec.cwt.states.start;

import org.wolftec.cwt.input.InputProvider;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.StateTransition;

public class TestFailedState extends AbstractState {

  @Override
  public void update(StateTransition transition, int delta, InputProvider input) {
    if (input.isActionPressed(GameActions.BUTTON_A)) {
      transition.setTransitionTo("StartScreenState");
    }
  }
}
