package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.AssertUtil;
import org.wolftec.cwt.logic.LifecycleLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

public class WaitUnit implements Action {

  private ModelManager   model;
  private LifecycleLogic lifecylce;

  @Override
  public String key() {
    return "wait";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return data.source.unit.canAct;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData) {
    actionData.p1 = positionData.source.unitId;
  }

  @Override
  public void checkData(ActionData data) {
    AssertUtil.assertThat(model.isValidUnitId(data.p1), "");
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    lifecylce.makeInactable(model.getUnit(data.p1));
  }

}
