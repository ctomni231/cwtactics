package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwt.system.NumberUtil;

public class IngameSubMenuState extends AbstractIngameState {

  private UserInteractionData data;
  private ErrorManager        errors;

  private boolean leavePossible;

  @Override
  public void onEnter(StateTransition transition) {
    String lastState = transition.getPreviousState().get();
    leavePossible = (lastState == "IngameMovepathSelectionState" || lastState == "IngameIdleState");
    if (data.getNumberOfInfos() == 0) {
      errors.raiseError("NoActionMenuData", ClassUtil.getClassName(IngameSubMenuState.class));
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
  public void handleButtonDown(StateTransition transition, int delta) {
    data.decreaseIndex();
  }

  @Override
  public void handleButtonUp(StateTransition transition, int delta) {
    data.increaseIndex();
  }

  @Override
  public void handleButtonA(StateTransition transition, int delta) {
    data.actionData = data.getInfo();
    data.actionDataCode = NumberUtil.safeStringAsInt(data.getInfo(), Constants.INACTIVE);
    transition.setTransitionTo("IngamePushActionState");
  }

  @Override
  public void handleButtonB(StateTransition transition, int delta) {
    if (leavePossible) {
      transition.setTransitionTo(transition.getPreviousState().get());
    }
  }
}
