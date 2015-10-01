package org.wolftec.cwt.states.ingame;

import org.stjs.javascript.Array;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwt.system.Log;

public class IngameMenuState extends AbstractIngameState {

  private Log log;

  private UserInteractionData data;
  private ErrorManager        errors;
  private MoveLogic           move;
  private ModelManager        model;

  private Array<Action> actionList;

  @Override
  public void onEnter(StateTransition transition) {
    data.cleanInfos();

    boolean movableUnitAtSource = data.source.unit.isPresent() && data.source.unit.get().canAct && move.canMoveSomewhere(model, data.source);

    ActionType wantedType = ActionType.MAP_ACTION;
    if (movableUnitAtSource) {
      wantedType = ActionType.UNIT_ACTION;
    }

    for (int i = 0; i < actionList.$length(); i++) {
      Action action = actionList.$get(i);

      if (action.type() == wantedType) {
        if (action.condition(uiData)) {
          data.addInfo(action.key(), true);
        }
      }
    }

    if (data.getNumberOfInfos() == 0) {
      errors.raiseError("NoActionAvailable", ClassUtil.getClassName(IngameMenuState.class));
    }
  }

  @Override
  public void handleButtonLeft(StateTransition transition, int delta) {
    // do nothing to block cursor movement
  }

  @Override
  public void handleButtonRight(StateTransition transition, int delta) {
    // do nothing to block cursor movement
  }

  @Override
  public void handleButtonUp(StateTransition transition, int delta) {
    data.decreaseIndex();
  }

  @Override
  public void handleButtonDown(StateTransition transition, int delta) {
    data.increaseIndex();
  }

  @Override
  public void handleButtonA(StateTransition transition, int delta) {
    data.action = data.getInfo();
    log.warn("MISSING SET ACTION_ID HERE");
    data.cleanInfos();
    data.getAction().prepareActionMenu(data);
    transition.setTransitionTo(data.getNumberOfInfos() > 0 ? "IngameSubMenuState" : "IngamePushActionState");
  }
}
