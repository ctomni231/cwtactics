package org.wolftec.cwt.input;

import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.UserInteractionMap;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Maybe;

public class AbstractMenuState extends AbstractState {

  private Log                  log;
  protected UserInteractionMap ui;

  @Override
  public Maybe<Class<? extends AbstractState>> update(int delta) {

    if (input.isActionPressed(GameActions.BUTTON_LEFT)) {
      ui.event(GameActions.BUTTON_LEFT);
    }

    if (input.isActionPressed(GameActions.BUTTON_RIGHT)) {
      ui.event(GameActions.BUTTON_RIGHT);
    }

    if (input.isActionPressed(GameActions.BUTTON_UP)) {
      ui.event(GameActions.BUTTON_UP);
    }

    if (input.isActionPressed(GameActions.BUTTON_DOWN)) {
      ui.event(GameActions.BUTTON_DOWN);
    }

    if (input.isActionPressed(GameActions.BUTTON_LEFT) || input.isActionPressed(GameActions.BUTTON_RIGHT) || input.isActionPressed(GameActions.BUTTON_DOWN)
        || input.isActionPressed(GameActions.BUTTON_UP)) {
      log.info("current ui state is " + ui.getState());
    }

    if (input.isActionPressed(GameActions.BUTTON_A)) {
      return handleButtonA(delta, ui.getState());
    }

    if (input.isActionPressed(GameActions.BUTTON_B)) {
      return handleButtonB(delta, ui.getState());
    }

    return NO_TRANSITION;
  }

  public Maybe<Class<? extends AbstractState>> handleButtonA(int delta, String currentUiState) {
    return NO_TRANSITION;
  }

  public Maybe<Class<? extends AbstractState>> handleButtonB(int delta, String currentUiState) {
    return NO_TRANSITION;
  }
}
