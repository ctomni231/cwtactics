package org.wolftec.cwt.controller.states.gameround;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.controller.states.base.GameroundState;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.core.NumberUtil;
import org.wolftec.cwt.core.javascript.JsUtil;

public class IngameSubMenuState extends GameroundState {

  private UserInteractionData data;

  private boolean leavePossible;

  @Override
  public void onEnter(StateFlowData transition) {
    String lastState = transition.getPreviousState();
    leavePossible = (lastState == "IngameMovepathSelectionState" || lastState == "IngameIdleState");
    if (data.getNumberOfInfos() == 0) {
      JsUtil.throwError("no action menu data");
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
  public void handleButtonDown(StateFlowData transition, int delta) {
    data.decreaseIndex();
  }

  @Override
  public void handleButtonUp(StateFlowData transition, int delta) {
    data.increaseIndex();
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta) {
    data.actionData = data.getInfo();
    data.actionDataCode = NumberUtil.asIntOrElse(data.getInfo(), Constants.INACTIVE);
    transition.setTransitionTo("IngamePushActionState");
  }

  @Override
  public void handleButtonB(StateFlowData transition, int delta) {
    if (leavePossible) {
      transition.setTransitionTo(transition.getPreviousState());
    }
  }
}
