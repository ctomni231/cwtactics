package org.wolftec.cwt.controller.states.base;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.model.gameround.GameroundEnder;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.view.input.InputService;

public class GameroundState extends State {

  protected Log log;

  protected UserInteractionData uiData;
  protected GameroundEnder model;

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
      flowData.requestInputBlock(Constants.CURSOR_MOVEMENT_BLOCK_TIME);
    }

    if (isLeftPressed) {
      handleButtonLeft(flowData, delta);
    }

    if (isRightPressed) {
      handleButtonRight(flowData, delta);
    }

    if (isUpPressed) {
      handleButtonUp(flowData, delta);
    }

    if (isDownPressed) {
      handleButtonDown(flowData, delta);
    }

    if (isAtLeastOneDPadButtonPressed) {
      Tile tile = model.getTile(uiData.cursorX, uiData.cursorY);
      Unit unit = tile.unit;
      Property prop = tile.property;
      log.info("cursor position [" + uiData.cursorX + ", " + uiData.cursorY + "] T[" + tile.type.ID + "] P[" + (NullUtil.isPresent(prop) ? prop.type.ID : "N/A")
          + "] U[" + (NullUtil.isPresent(unit) ? unit.type.ID : "N/A") + "]");
    }

    if (isAPressed) {
      handleButtonA(flowData, delta);
    } else if (isBPressed) {
      handleButtonB(flowData, delta);
    }
  }

  public void handleButtonUp(StateFlowData transition, int delta) {
    if (uiData.cursorY > 0) {
      uiData.cursorY--;
    }
  }

  public void handleButtonDown(StateFlowData transition, int delta) {
    if (uiData.cursorY < model.mapHeight) {
      uiData.cursorY++;
    }
  }

  public void handleButtonRight(StateFlowData flowData, int delta) {
    if (uiData.cursorX < model.mapWidth) {
      uiData.cursorX++;
    }
  }

  public void handleButtonLeft(StateFlowData flowData, int delta) {
    if (uiData.cursorX > 0) {
      uiData.cursorX--;
    }
  }

  public void handleButtonA(StateFlowData transition, int delta) {
  }

  public void handleButtonB(StateFlowData transition, int delta) {
    transition.setTransitionTo(transition.getPreviousState());
  }
}
