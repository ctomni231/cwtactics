package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.action.TileMeta;
import org.wolftec.cwt.logic.JoinLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;

public class JoinUnit implements Action
{

  private JoinLogic    join;
  private ModelManager model;

  @Override
  public String key()
  {
    return "joinUnits";
  }

  @Override
  public ActionType type()
  {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean noAutoWait()
  {
    return false;
  }

  @Override
  public void fillData(UserInteractionData positionData, ActionData actionData)
  {
    actionData.p1 = positionData.source.unitId;
    actionData.p2 = positionData.target.x;
    actionData.p3 = positionData.target.y;
  }

  @Override
  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag)
  {
    return unitFlag == TileMeta.OWN;
  }

  @Override
  public boolean condition(UserInteractionData data)
  {
    return join.canJoin(data.source.unit, data.target.unit);
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    join.join(model.getUnit(data.p1), data.p2, data.p3);
  }

}
