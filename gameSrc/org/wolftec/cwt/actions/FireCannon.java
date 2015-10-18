package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.logic.SpecialWeaponsLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

public class FireCannon implements Action {

  private SpecialWeaponsLogic cannon;
  private ModelManager        model;

  @Override
  public String key() {
    return "fireCannon";
  }

  @Override
  public ActionType type() {
    return ActionType.PROPERTY_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return false;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
  }

  // require('../actions').unitAction({
  // key: "fireCannon",
  //
  // relation: [
  // "S", "T",
  // cwt.Relationship.RELATION_SAME_THING
  // ],
  //
  // condition: function (data) {
  // return (
  // cwt.Cannon.isCannonUnit(data.source.unit) &&
  // cwt.Cannon.hasTargets(data.source.x, data.source.y, null)
  // );
  // },
  //
  // targetSelectionType: "A",
  // prepareTargets: function (data) {
  // cwt.Cannon.fillCannonTargets(data.source.x, data.source.y, data.selection);
  // },
  //
  // toDataBlock: function (data, dataBlock) {
  // dataBlock.p1 = data.source.x;
  // dataBlock.p2 = data.source.y;
  // dataBlock.p3 = data.targetselection.x;
  // dataBlock.p4 = data.targetselection.y;
  // },
  //
  // parseDataBlock: function (dataBlock) {
  // cwt.Cannon.fireCannon(dataBlock.p1, dataBlock.p2,dataBlock.p3,
  // dataBlock.p4);
  // }
  //
  // });

}
