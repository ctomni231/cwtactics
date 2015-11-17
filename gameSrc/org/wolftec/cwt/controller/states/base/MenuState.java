package org.wolftec.cwt.controller.states.base;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.log.LogFactory;
import org.wolftec.cwt.view.input.InputService;

public class MenuState extends State {

  private Log log;
  protected MenuStateInteraction ui;

  public MenuState() {
    log = LogFactory.byClass(this.getClass());
    ui = new MenuStateInteraction();
    constructUI(ui);
  }

  protected void constructUI(MenuStateInteraction ui) {

  }

  @Override
  public void update(StateFlowData flowData, int delta, InputService input) {

    boolean isLeftPressed = input.isActionPressed(GameActionConstants.BUTTON_LEFT);
    boolean isRightPressed = input.isActionPressed(GameActionConstants.BUTTON_RIGHT);
    boolean isUpPressed = input.isActionPressed(GameActionConstants.BUTTON_UP);
    boolean isDownPressed = input.isActionPressed(GameActionConstants.BUTTON_DOWN);
    boolean isBPressed = input.isActionPressed(GameActionConstants.BUTTON_B);
    boolean isAPressed = input.isActionPressed(GameActionConstants.BUTTON_A);

    boolean isAtLeastOneDPadButtonPressed = (isDownPressed || isRightPressed || isLeftPressed || isUpPressed);
    boolean isAtLeastOneButtonPressed = (isAtLeastOneDPadButtonPressed || isAPressed || isBPressed);

    if (isAtLeastOneButtonPressed) {
      flowData.requestInputBlock(Constants.MENU_INPUT_BLOCK_TIME);
    }

    if (isLeftPressed) {
      ui.event(GameActionConstants.BUTTON_LEFT);
    }

    if (isRightPressed) {
      ui.event(GameActionConstants.BUTTON_RIGHT);
    }

    if (isUpPressed) {
      flowData.requestInputBlock(Constants.MENU_INPUT_BLOCK_TIME);
      ui.event(GameActionConstants.BUTTON_UP);
    }

    if (isDownPressed) {
      ui.event(GameActionConstants.BUTTON_DOWN);
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
