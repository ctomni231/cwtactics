package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateFlowData;

public class IngameLeaveState extends AbstractState {

  @Override
  public void onEnter(StateFlowData transition) {
    transition.setTransitionTo("MainMenuState");
  }
}
