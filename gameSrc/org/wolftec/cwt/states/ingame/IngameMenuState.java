package org.wolftec.cwt.states.ingame;

import org.stjs.javascript.Array;
import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.base.AbstractIngameState;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.NullUtil;

public class IngameMenuState extends AbstractIngameState {

  private Log log;

  private MoveLogic move;
  private ModelManager model;

  private Array<Action> actionList;

  @Override
  public void onEnter(StateFlowData transition) {
    uiData.cleanInfos();

    boolean movableUnitAtSource = NullUtil.isPresent(uiData.source.unit) && uiData.source.unit.canAct && move.canMoveSomewhere(model, uiData.source);

    ActionType wantedType = ActionType.MAP_ACTION;
    if (movableUnitAtSource) {
      wantedType = ActionType.UNIT_ACTION;
    }

    for (int i = 0; i < actionList.$length(); i++) {
      Action action = actionList.$get(i);

      if (action.type() == wantedType) {
        if (action.isUsable(uiData)) {
          uiData.addInfo(action.key(), true);
        }
      }
    }

    if (uiData.getNumberOfInfos() == 0) {
      /*
       * this can happen especially when you click on an own transport unit in
       * your move path, which is not able to load the selected unit.
       */
      transition.setTransitionTo(uiData.movePath.isEmpty() ? "IngameIdleState" : "IngameMovepathSelectionState");
    }
  }

  @Override
  public void handleButtonLeft(StateFlowData transition, int delta) {
    // do nothing to block cursor movement
  }

  @Override
  public void handleButtonRight(StateFlowData transition, int delta) {
    // do nothing to block cursor movement
  }

  @Override
  public void handleButtonUp(StateFlowData transition, int delta) {
    uiData.decreaseIndex();
  }

  @Override
  public void handleButtonDown(StateFlowData transition, int delta) {
    uiData.increaseIndex();
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta) {
    uiData.action = uiData.getInfo();
    log.warn("MISSING SET ACTION_ID HERE");

    uiData.cleanInfos();
    if (uiData.getAction().hasSubMenu()) {
      uiData.getAction().prepareActionMenu(uiData);

      if (uiData.getNumberOfInfos() == 0) {
        JsUtil.throwError("NoActionAvailable");
      }

      transition.setTransitionTo("IngameSubMenuState");
    } else {
      transition.setTransitionTo("IngamePushActionState");
    }
  }
}
