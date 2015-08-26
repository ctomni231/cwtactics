package org.wolftec.cwt.states.menu;

import org.wolftec.cwt.input.AbstractMenuState;
import org.wolftec.cwt.states.StateTransition;

public class PlayerSetupMenuState extends AbstractMenuState {

  @Override
  public void handleButtonA(StateTransition transition, int delta, String currentUiState) {
    transition.setTransitionTo(ParameterSetupMenuState.class);
  }
}
