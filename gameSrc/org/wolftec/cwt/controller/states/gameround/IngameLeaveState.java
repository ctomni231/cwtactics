package org.wolftec.cwt.controller.states.gameround;

import org.wolftec.cwt.controller.states.base.State;
import org.wolftec.cwt.controller.states.base.StateFlowData;

public class IngameLeaveState extends State {

  @Override
  public void onEnter(StateFlowData transition) {
    transition.setTransitionTo("MainMenuState");
  }
}
