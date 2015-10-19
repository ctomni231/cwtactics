package org.wolftec.cwt.states.ingame;

import org.stjs.javascript.Array;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.action.PositionCheck;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.state.AbstractIngameState;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.ClassUtil;
import org.wolftec.cwt.core.util.NullUtil;
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

    boolean movableUnitAtSource = NullUtil.isPresent(uiData.source.unit) && uiData.source.unit.canAct && move.canMoveSomewhere(model, uiData.source);

    ActionType wantedType = ActionType.MAP_ACTION;
    if (movableUnitAtSource) {
      wantedType = ActionType.UNIT_ACTION;
    }

    // TODO ALLY
    // TODO TARGET - SOURCE SAME THING CHECK
    PositionCheck sourceUnit = NullUtil.isPresent(uiData.source.unit) ? PositionCheck.OWN : PositionCheck.EMPTY;
    PositionCheck sourceProperty = NullUtil.isPresent(uiData.source.property)
        ? ((uiData.source.property.owner == uiData.actor) ? PositionCheck.OWN : PositionCheck.ENEMY) : PositionCheck.EMPTY;
    PositionCheck targetUnit = NullUtil.isPresent(uiData.target.unit) ? ((uiData.target.unit.owner == uiData.actor) ? PositionCheck.OWN : PositionCheck.ENEMY)
        : PositionCheck.EMPTY;
    PositionCheck targetProperty = NullUtil.isPresent(uiData.target.property)
        ? ((uiData.target.property.owner == uiData.actor) ? PositionCheck.OWN : PositionCheck.ENEMY) : PositionCheck.EMPTY;

    for (int i = 0; i < actionList.$length(); i++) {
      Action action = actionList.$get(i);

      if (action.type() == wantedType) {
        if (action.checkSource(sourceUnit, sourceProperty) && action.checkTarget(targetUnit, targetProperty)) {
          if (action.condition(uiData)) {
            uiData.addInfo(action.key(), true);
          }
        }
      }
    }

    if (uiData.getNumberOfInfos() == 0) {
      /*
       * this can happen especially when you click on an own transport unit in
       * your move path, which is not able to load the selected unit.
       */
      transition.setTransitionTo(uiData.movePath.isEmpty() ? "IngameIdleState" : "IngameMenuState");
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
