package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;

public class GameOpenOptionsAction extends AbstractAction {

  @Override
  public String key() {
    return "options";
  }

  @Override
  public ActionType type() {
    return ActionType.MAP_ACTION;
  }

  @Override
  public boolean noAutoWait() {
    return true;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    controller.transition.setTransitionTo("IngameOptionsMenuState");
  }

}
