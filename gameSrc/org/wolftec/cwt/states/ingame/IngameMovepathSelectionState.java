package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.config.OptionsManager;
import org.wolftec.cwt.core.input.InputProvider;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UserInteractionData;

public class IngameMovepathSelectionState extends AbstractIngameState {

  private UserInteractionData data;

  private OptionsManager options;
  private MoveLogic      move;
  private ModelManager   model;

  private void updateMovepath() {
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

    } else if (dis > 1) {

      /*
       * Generate a complete new path because between the old tile and the new
       * tile is at least another one tile
       */
      move.generateMovePath(data.source.x, data.source.y, x, y, data.targets, data.movePath);
    }
  }

  @Override
  public void onEnter(StateFlowData transition) {

    /*
     * when we do back steps in the game flow then we don't want to recreate an
     * already created move way
     */
    if (data.preventMovepathGeneration) {
      data.preventMovepathGeneration = false;
      return;
    }

    boolean breakMove = false;
    if (model.isTurnOwnerObject(data.source.unit.get()) && data.source.unit.get().canAct) {
      data.movePath.clear();
      move.fillMoveMap(data.source, data.targets);

      // go directly into action menu when the unit cannot move
      if (!data.targets.hasActiveNeighbour(data.source.x, data.source.y)) {
        breakMove = true;
      }

    } else {
      breakMove = true;
    }

    if (breakMove) {
      transition.setTransitionTo("IngameMenuState");
    }
  }

  @Override
  public void onExit(StateFlowData transition) {
    data.targets.reset();
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta) {
    if (model.getDistance(data.cursorX, data.cursorY, data.target.x, data.target.y) == 0 || options.fastClickMode.value == 1) {
      transition.setTransitionTo("IngameMenuState");
    }
  }

  @Override
  public void update(StateFlowData flowData, int delta, InputProvider input) {
    super.update(flowData, delta, input);
    updateMovepath();
  }
}
