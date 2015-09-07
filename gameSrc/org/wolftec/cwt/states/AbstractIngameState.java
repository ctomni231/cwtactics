package org.wolftec.cwt.states;

import org.wolftec.cwt.core.action.ActionManager;
import org.wolftec.cwt.states.ingame.IngameEvalActionState;

public class AbstractIngameState extends AbstractState {

  private ActionManager actions;

  @Override
  public void update(StateTransition transition, int delta) {

    /*
     * We move out of this state directly here when we have actions in the
     * actions buffer.
     */
    if (actions.hasData()) {
      transition.setTransitionTo(IngameEvalActionState.class);
      return;
    }

    if (input.isActionPressed(GameActions.BUTTON_LEFT)) {
      handleButtonLeft(transition, delta);
    }

    if (input.isActionPressed(GameActions.BUTTON_RIGHT)) {
      handleButtonRight(transition, delta);
    }

    if (input.isActionPressed(GameActions.BUTTON_UP)) {
      handleButtonUp(transition, delta);
    }

    if (input.isActionPressed(GameActions.BUTTON_DOWN)) {
      handleButtonDown(transition, delta);
    }

    // stateData.setCursorPosition(renderer.convertToTilePos(x),
    // renderer.convertToTilePos(y), true);
    // TODO

    if (input.isActionPressed(GameActions.BUTTON_A)) {
      handleButtonA(transition, delta);

    } else if (input.isActionPressed(GameActions.BUTTON_B)) {
      handleButtonB(transition, delta);
    }
  }

  public void handleButtonUp(StateTransition transition, int delta) {
  }

  public void handleButtonDown(StateTransition transition, int delta) {
  }

  public void handleButtonLeft(StateTransition transition, int delta) {
  }

  public void handleButtonRight(StateTransition transition, int delta) {
  }

  public void handleButtonA(StateTransition transition, int delta) {
  }

  public void handleButtonB(StateTransition transition, int delta) {
    transition.setTransitionTo(transition.getPreviousState().get());
  }
}
