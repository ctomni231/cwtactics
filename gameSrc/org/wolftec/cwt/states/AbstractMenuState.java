package org.wolftec.cwt.states;

import org.wolftec.cwt.system.Log;

public class AbstractMenuState extends AbstractState {

  private Log                  log;
  protected UserInteractionMap ui;

  @Override
  public void update(StateTransition transition, int delta) {

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
      handleButtonA(transition, delta, ui.getState());
    }

    if (input.isActionPressed(GameActions.BUTTON_B)) {
      handleButtonB(transition, delta, ui.getState());
    }
  }

  public void handleButtonA(StateTransition transition, int delta, String currentUiState) {
  }

  public void handleButtonB(StateTransition transition, int delta, String currentUiState) {
  }
}
