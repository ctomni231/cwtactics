package org.wolftec.cwt.states.start;

import org.wolftec.cwt.core.input.InputProvider;
import org.wolftec.cwt.core.state.AbstractState;
import org.wolftec.cwt.core.state.GameActions;
import org.wolftec.cwt.core.state.StateFlowData;

public class TestSucceededState extends AbstractState {

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    if (input.isActionPressed(GameActions.BUTTON_A)) {
      transition.setTransitionTo("StartScreenState");
    }
  }
}
