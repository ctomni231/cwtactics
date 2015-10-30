package org.wolftec.cwt.states.ingame;

import org.wolftec.wTec.state.AbstractState;
import org.wolftec.wTec.state.StateFlowData;

public class IngameLeaveState extends AbstractState {

  @Override
  public void onEnter(StateFlowData transition) {
    transition.setTransitionTo("MainMenuState");
  }
}
