package org.wolftec.cwt.controller.states.menu;

import org.wolftec.cwt.controller.states.base.State;
import org.wolftec.cwt.controller.states.base.GameActionConstants;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.view.input.InputService;

public class RemapInputMenuState extends State {

  private static String UIC_BUTTON_LEFT = "MAP_LEFT";
  private static String UIC_BUTTON_UP = "MAP_UP";
  private static String UIC_BUTTON_DOWN = "MAP_DOWN";
  private static String UIC_BUTTON_RIGHT = "MAP_RIGHT";
  private static String UIC_BUTTON_A = "MAP_A";
  private static String UIC_BUTTON_B = "MAP_B";

  @Override
  public void update(StateFlowData transition, int delta, InputService input) {
    if (input.isActionPressed(GameActionConstants.BUTTON_B)) {
      transition.setTransitionTo(transition.getPreviousState());
    }
  }
}
