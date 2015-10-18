package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.logic.LaserLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

public class FireLaser implements Action {

  private LaserLogic   laser;
  private ModelManager model;

  @Override
  public String key() {
    return "fireTurret";
  }

  @Override
  public ActionType type() {
    return ActionType.PROPERTY_ACTION;
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
