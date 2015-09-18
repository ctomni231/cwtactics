package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.ErrorManager;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwt.system.Log;

public class IngameMenuState extends AbstractIngameState {

  private Log log;

  private UserInteractionData data;
  private ErrorManager        errors;

  @Override
  public void onEnter(StateTransition transition) {
    data.cleanInfos();

    // TODO
    // stateData.menu.generate();

    if (data.getNumberOfInfos() == 0) {
      errors.raiseError("NoUnitActionAvailable", ClassUtil.getClassName(IngameMenuState.class));
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
