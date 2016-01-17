package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.logic.TeamLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;
import org.wolftec.cwt.util.AssertUtil;

public class TransferProperty implements Action
{

  private TeamLogic team;
  private ModelManager model;

  @Override
  public String key()
  {
    return "transferProperty";
  }

  @Override
  public ActionType type()
  {
    return ActionType.PROPERTY_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data)
  {
    return team.canTransferProperty(data.source.property);
  }

  @Override
  public boolean hasSubMenu()
  {
    return true;
  }

  @Override
  public void prepareActionMenu(UserInteractionData data)
  {
    team.getPropertyTransferTargets(data.source.property.owner, t -> data.addInfo(t + "", true));
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData)
  {
    actionData.p1 = interactionData.source.propertyId;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void checkData(ActionData data)
  {
    AssertUtil.assertThat(model.isValidPropertyId(data.p1), "");
    AssertUtil.assertThat(model.isValidPlayerId(data.p2), "");
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition)
  {
    team.transferPropertyToPlayer(model.getProperty(data.p1), model.getPlayer(data.p2));
  }

}
