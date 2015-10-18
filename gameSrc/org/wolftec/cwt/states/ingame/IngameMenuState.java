package org.wolftec.cwt.states.ingame;

import org.stjs.javascript.Array;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.state.AbstractIngameState;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.ClassUtil;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.gameround.ModelManager;

public class IngameMenuState extends AbstractIngameState {

  private Log log;

  private ErrorManager errors;
  private MoveLogic    move;
  private ModelManager model;

  private Array<Action> actionList;

  @Override
  public void onEnter(StateFlowData transition) {
    uiData.cleanInfos();

    boolean movableUnitAtSource = uiData.source.unit.isPresent() && uiData.source.unit.get().canAct && move.canMoveSomewhere(model, uiData.source);

    ActionType wantedType = ActionType.MAP_ACTION;
    if (movableUnitAtSource) {
      wantedType = ActionType.UNIT_ACTION;
    }

    for (int i = 0; i < actionList.$length(); i++) {
      Action action = actionList.$get(i);

      if (action.type() == wantedType) {
        if (action.condition(uiData)) {
          uiData.addInfo(action.key(), true);
        }
      }
    }

    if (uiData.getNumberOfInfos() == 0) {
      errors.raiseError("NoActionAvailable", ClassUtil.getClassName(IngameMenuState.class));
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
        errors.raiseError("NoActionAvailable", ClassUtil.getClassName(IngameMenuState.class));
      }

      transition.setTransitionTo("IngameSubMenuState");
    } else {
      transition.setTransitionTo("IngamePushActionState");
    }
  }
}
