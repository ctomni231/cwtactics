package org.wolftec.cwt.wotec.state;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.wotec.input.InputProvider;
import org.wolftec.cwt.wotec.log.Log;

public class AbstractMenuState extends AbstractState {

  private Log                  log;
  protected MenuInteractionMap ui;

  @Override
  public void update(StateFlowData flowData, int delta, InputProvider input) {

    boolean isLeftPressed = input.isActionPressed(GameActions.BUTTON_LEFT);
    boolean isRightPressed = input.isActionPressed(GameActions.BUTTON_RIGHT);
    boolean isUpPressed = input.isActionPressed(GameActions.BUTTON_UP);
    boolean isDownPressed = input.isActionPressed(GameActions.BUTTON_DOWN);
    boolean isBPressed = input.isActionPressed(GameActions.BUTTON_B);
    boolean isAPressed = input.isActionPressed(GameActions.BUTTON_A);

    boolean isAtLeastOneDPadButtonPressed = (isDownPressed || isRightPressed || isLeftPressed || isUpPressed);
    boolean isAtLeastOneButtonPressed = (isAtLeastOneDPadButtonPressed || isAPressed || isBPressed);

    if (isAtLeastOneButtonPressed) {
      flowData.requestInputBlock(Constants.MENU_INPUT_BLOCK_TIME);
    }

    if (isLeftPressed) {
      ui.event(GameActions.BUTTON_LEFT);
    }

    if (isRightPressed) {
      ui.event(GameActions.BUTTON_RIGHT);
    }

    if (isUpPressed) {
      flowData.requestInputBlock(Constants.MENU_INPUT_BLOCK_TIME);
      ui.event(GameActions.BUTTON_UP);
    }

    if (isDownPressed) {
      ui.event(GameActions.BUTTON_DOWN);
    }

    if (isAtLeastOneDPadButtonPressed) {
      log.info("current ui state is " + ui.getState());
    }

    if (isAPressed) {
      handleButtonA(flowData, delta, ui.getState());
    }

    if (isBPressed) {
      handleButtonB(flowData, delta, ui.getState());
    }
  }

  public void handleButtonA(StateFlowData transition, int delta, String currentUiState) {
  }

  public void handleButtonB(StateFlowData transition, int delta, String currentUiState) {
  }
}
