package org.wolftec.cwt.core.state;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.action.ActionManager;
import org.wolftec.cwt.core.input.InputProvider;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.states.UserInteractionData;

public class AbstractIngameState extends AbstractState {

  protected Log log;

  protected ActionManager       actions;
  protected UserInteractionData uiData;

  protected ModelManager __model__;

  @Override
  public void update(StateFlowData flowData, int delta, InputProvider input) {

    /*
     * We move out of this state directly here when we have actions in the
     * actions buffer.
     */
    if (actions.hasData()) {
      flowData.setTransitionTo("IngameEvalActionState");
      return;
    }

    boolean isLeftPressed = input.isActionPressed(GameActions.BUTTON_LEFT);
    boolean isRightPressed = input.isActionPressed(GameActions.BUTTON_RIGHT);
    boolean isUpPressed = input.isActionPressed(GameActions.BUTTON_UP);
    boolean isDownPressed = input.isActionPressed(GameActions.BUTTON_DOWN);
    boolean isBPressed = input.isActionPressed(GameActions.BUTTON_B);
    boolean isAPressed = input.isActionPressed(GameActions.BUTTON_A);

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
      Tile tile = __model__.getTile(uiData.cursorX, uiData.cursorY);
      Unit unit = tile.unit;
      Property prop = tile.property;
      log.info("cursor position [" + uiData.cursorX + ", " + uiData.cursorY + "] T[" + tile.type.ID + "] P[" + (NullUtil.isPresent(prop) ? prop.type.ID : "N/A")
          + "] U[" + (NullUtil.isPresent(unit) ? unit.type.ID : "N/A") + "]");
    }

    // stateData.setCursorPosition(renderer.convertToTilePos(x),
    // renderer.convertToTilePos(y), true);
    // TODO

    if (isAPressed) {
      handleButtonA(flowData, delta);
    } else if (isBPressed) {
      handleButtonB(flowData, delta);
    }
  }

  public void handleButtonUp(StateFlowData transition, int delta) {
    uiData.cursorY--;
    if (uiData.cursorY < 0) {
      uiData.cursorY = 0;
    }
  }

  public void handleButtonDown(StateFlowData transition, int delta) {
    uiData.cursorY++;
    // TODO
    // if (uiData.cursorY >= ) {
    // uiData.cursorY = 0;
    // }
  }

  public void handleButtonRight(StateFlowData flowData, int delta) {
    uiData.cursorX++;
    // TODO
    // if (uiData.cursorX >= ) {
    // }
  }

  public void handleButtonLeft(StateFlowData flowData, int delta) {
    uiData.cursorX--;
    if (uiData.cursorX < 0) {
      uiData.cursorX = 0;
    }
  }

  public void handleButtonA(StateFlowData transition, int delta) {
  }

  public void handleButtonB(StateFlowData transition, int delta) {
    transition.setTransitionTo(transition.getPreviousState().get());
  }
}
