package org.wolftec.cwt.states.start;

import org.wolftec.cwt.wotec.env.Features;
import org.wolftec.cwt.wotec.input.InputProvider;
import org.wolftec.cwt.wotec.input.backends.KeyboardInput;
import org.wolftec.cwt.wotec.state.AbstractState;
import org.wolftec.cwt.wotec.state.GameActions;
import org.wolftec.cwt.wotec.state.StateFlowData;

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
