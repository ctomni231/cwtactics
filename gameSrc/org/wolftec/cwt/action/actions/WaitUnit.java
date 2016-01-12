package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.logic.LifecycleLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;
import org.wolftec.cwt.util.AssertUtil;

public class WaitUnit implements Action
{

  private ModelManager   model;
  private LifecycleLogic lifecylce;

  @Override
  public String key()
  {
    return "wait";
  }

  @Override
  public ActionType type()
  {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data)
  {
    return lifecylce.isActable(data.source.unit);
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData)
  {
    actionData.p1 = positionData.source.unitId;
  }

  @Override
  public void checkData(ActionData data)
  {
    AssertUtil.assertThat(model.isValidUnitId(data.p1), "");
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    lifecylce.makeInactable(model.getUnit(data.p1));
  }

}
