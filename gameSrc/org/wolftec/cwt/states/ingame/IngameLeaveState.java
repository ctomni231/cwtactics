package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.states.base.AbstractState;
import org.wolftec.cwt.states.base.StateFlowData;

public class IngameLeaveState extends AbstractState {

  @Override
  public void onEnter(StateFlowData transition) {
    transition.setTransitionTo("MainMenuState");
  }
}
