package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.logic.Action;
import org.wolftec.cwt.logic.ActionData;
import org.wolftec.cwt.logic.ActionType;
import org.wolftec.cwt.logic.TileMeta;
import org.wolftec.cwt.logic.features.SpecialWeaponsLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UserInteractionData;

public class FireSilo implements Action {

  private SpecialWeaponsLogic weapons;
  private ModelManager model;

  @Override
  public String key() {
    return "fireSilo";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag) {
    return unitFlag == TileMeta.EMPTY;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return weapons.isRocketSilo(data.target.property) && weapons.canBeFiredBy(data.target.property, data.source.unit);
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
    actionData.p1 = positionData.target.x;
    actionData.p2 = positionData.target.y;
    actionData.p3 = positionData.actionTarget.x;
    actionData.p4 = positionData.actionTarget.y;
    actionData.p5 = positionData.target.unitId;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    weapons.fireSilo(data.p1, data.p2, data.p3, data.p4);
  }

}
