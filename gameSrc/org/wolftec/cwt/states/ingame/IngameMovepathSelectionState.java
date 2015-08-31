package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.config.OptionsManager;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;

public class IngameMovepathSelectionState extends AbstractState {

  private UserInteractionData data;
  private OptionsManager      options;
  private MoveLogic           move;
  private ModelManager        model;

  private Class<? extends AbstractState> lastState;

  private void setMovePathTarget() {
    int x = data.cursorX;
    int y = data.cursorY;

    /*
     * selected tile is not in the selection -> ignore action
     */
    if (data.targets.getValue(x, y) < 0) {
      return;
    }

    int ox = data.target.x;
    int oy = data.target.y;
    int dis = model.getDistance(ox, oy, x, y);

    data.target.set(model, x, y);

    if (dis == 1) {

      /*
       * Try to add the cursor move as code to the move path
       */
      move.addCodeToMovePath(move.codeFromAtoB(ox, oy, x, y), data.movePath, data.targets, data.source.x, data.source.y);

    } else {

      /*
       * Generate a complete new path because between the old tile and the new
       * tile is at least another one tile
       */
      move.generateMovePath(data.source.x, data.source.y, x, y, data.targets, data.movePath);
    }
  }

  @Override
  public void onEnter(StateTransition transition) {
    // lastState = previous.get();
    //
    // // when we do back steps in the game flow then we don't want to recreate
    // an
    // // already created move way
    // if (stateData.preventMovePathGeneration) {
    // stateData.preventMovePathGeneration = false;
    // return;
    // }
    //
    // boolean breakMove = false;
    //
    // if (model.isTurnOwnerObject(data.source.unit) && data.source.unit.canAct)
    // {
    //
    // // prepare move map and clean way
    // data.movePath.clear();
    //
    // move.fillMoveMap(data.source, data.targets);
    //
    // // go directly into action menu when the unit cannot move
    // if (!data.targets.hasActiveNeighbour(data.source.x, data.source.y)) {
    // breakMove = true;
    // }
    // } else {
    // breakMove = true;
    // }
    //
    // if (breakMove) {
    // this.changeState("INGAME_MENU");
    // }
  }

  @Override
  public void onExit(StateTransition transition) {
    data.targets.reset();
  }

  @Override
  public void update(StateTransition transition, int delta) {
    //
    // int ox = data.cursorX;
    // int oy = data.cursorY;
    //
    // stateData.setCursorPosition(renderer.convertToTilePos(x),
    // renderer.convertToTilePos(y), true);
    //
    // int nx = data.cursorX;
    // int ny = data.cursorY;
    // if (ox != nx || oy || ny) setMovePathTarget();
    //
    // if (input.isActionPressed(GameActions.BUTTON_LEFT)) {
    // stateData.moveCursor(move.MOVE_CODES_LEFT);
    // setMovePathTarget();
    //
    // } else if (input.isActionPressed(GameActions.BUTTON_RIGHT)) {
    // stateData.moveCursor(move.MOVE_CODES_RIGHT);
    // setMovePathTarget();
    //
    // } else if (input.isActionPressed(GameActions.BUTTON_UP)) {
    // stateData.moveCursor(move.MOVE_CODES_UP);
    // setMovePathTarget();
    //
    // } else if (input.isActionPressed(GameActions.BUTTON_DOWN)) {
    // stateData.moveCursor(move.MOVE_CODES_DOWN);
    // setMovePathTarget();
    //
    // } else if (input.isActionPressed(GameActions.BUTTON_A)) {
    // int x = data.cursorX;
    // int y = data.cursorY;
    // ox = data.target.x;
    // oy = data.target.y;
    // if (model.getDistance(x, y, ox, oy) == 0 || options.fastClickMode.value
    // == 1) {
    // return Option.of(IngameMenuState.class);
    // }
    //
    // } else if (input.isActionPressed(GameActions.BUTTON_B)) {
    // return Option.of(lastState);
    // }
    //
    // return NO_TRANSITION;
  }
}
