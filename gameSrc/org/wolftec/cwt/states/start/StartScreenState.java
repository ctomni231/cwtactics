package org.wolftec.cwt.states.start;

import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.states.menu.MainMenuState;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Maybe;

public class StartScreenState implements State {

  private Log          log;
  private InputManager input;

  @Override
  public void enter() {
    setupDevKeys();
  }

  private void setupDevKeys() {
    log.info("setup development input mapping");
    input.setButtonMapping("ENTER", GameActions.BUTTON_A);
    input.setButtonMapping("CTRL", GameActions.BUTTON_B);
    input.setButtonMapping("ARROW LEFT", GameActions.BUTTON_LEFT);
    input.setButtonMapping("ARROW RIGHT", GameActions.BUTTON_RIGHT);
    input.setButtonMapping("ARROW UP", GameActions.BUTTON_UP);
    input.setButtonMapping("ARROW DOWN", GameActions.BUTTON_DOWN);
  }

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {
    return input.isActionPressed(GameActions.BUTTON_A) ? Maybe.of(MainMenuState.class) : NO_TRANSITION;
  }
}
