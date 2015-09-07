package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.action.ActionManager;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.NumberUtil;

public class IngameSubMenuState extends AbstractIngameState {

  private UserInteractionData data;

  private ActionManager actions;

  @Override
  public void onEnter(StateTransition transition) {
    data.getAction().prepareMenu(data);
  }

  @Override
  public void handleButtonLeft(StateTransition transition, int delta) {
  }

  @Override
  public void handleButtonRight(StateTransition transition, int delta) {
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

    try {
      data.actionDataCode = NumberUtil.stringAsInt(data.getInfo());

    } catch (Exception ignore) {
      data.actionDataCode = Constants.INACTIVE;
    }

    transition.setTransitionTo(IngamePushActionState.class);
  }

  @Override
  public void handleButtonB(StateTransition transition, int delta) {
    transition.setTransitionTo(transition.getPreviousState().get());
  }
}
