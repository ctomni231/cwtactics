package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.logic.features.LaserLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.wotec.action.Action;
import org.wolftec.cwt.wotec.action.ActionData;
import org.wolftec.cwt.wotec.action.ActionType;
import org.wolftec.cwt.wotec.state.StateFlowData;

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
