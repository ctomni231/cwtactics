package org.wolftec.cwt.states.menu;

import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.system.Maybe;

public class MainMenuState implements State {

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {
    return input.isActionPressed(GameActions.BUTTON_A) ? Maybe.of(MapSelectionState.class) : NO_TRANSITION;
  }
}
