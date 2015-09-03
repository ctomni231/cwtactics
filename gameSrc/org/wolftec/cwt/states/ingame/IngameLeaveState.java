package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.menu.MainMenuState;

public class IngameLeaveState extends AbstractState {

  @Override
  public void onEnter(StateTransition transition) {
    transition.setTransitionTo(MainMenuState.class);
  }
}
