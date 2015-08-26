package org.wolftec.cwt.states.menu;

import org.wolftec.cwt.input.AbstractMenuState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.ingame.IngameEnterState;

public class ParameterSetupMenuState extends AbstractMenuState {

  private static final String UIC_TURN_LIMIT     = "TURN_LIMIT";
  private static final String UIC_CAPTURE_LIMIT  = "CAPTURE_LIMIT";
  private static final String UIC_GAMETIME_LIMIT = "GAMETIME_LIMIT";
  private static final String UIC_TURNTIME_LIMIT = "TURNTIME_LIMIT";

  @Override
  public void handleButtonA(StateTransition transition, int delta, String currentUiState) {
    transition.setTransitionTo(IngameEnterState.class);
  }
}
