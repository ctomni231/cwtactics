package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.wotec.state.AbstractState;
import org.wolftec.cwt.wotec.state.StateFlowData;

public class IngameLeaveState extends AbstractState {

  @Override
  public void onEnter(StateFlowData transition) {
    transition.setTransitionTo("MainMenuState");
  }
}
