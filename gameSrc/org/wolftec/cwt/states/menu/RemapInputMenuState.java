package org.wolftec.cwt.states.menu;

import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.StateTransition;

public class RemapInputMenuState extends AbstractState {

  private static String UIC_BUTTON_LEFT  = "MAP_LEFT";
  private static String UIC_BUTTON_UP    = "MAP_UP";
  private static String UIC_BUTTON_DOWN  = "MAP_DOWN";
  private static String UIC_BUTTON_RIGHT = "MAP_RIGHT";
  private static String UIC_BUTTON_A     = "MAP_A";
  private static String UIC_BUTTON_B     = "MAP_B";

  private boolean       setInput;

  @Override
  public void onEnter(StateTransition transition) {
    if (input.isActionPressed(GameActions.BUTTON_B)) {
      transition.setTransitionTo(transition.getPreviousState().get());
    }
  }
}
