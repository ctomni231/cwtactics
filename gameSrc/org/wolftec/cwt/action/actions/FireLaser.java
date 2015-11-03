package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.logic.LaserLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;

public class FireLaser implements Action {

  private LaserLogic laser;
  private ModelManager model;

  @Override
  public String key() {
    return "fireTurret";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return laser.isLaser(data.source.unit);
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
    actionData.p1 = positionData.target.x;
    actionData.p2 = positionData.target.y;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    laser.fireLaser(data.p1, data.p2);
  }

}
