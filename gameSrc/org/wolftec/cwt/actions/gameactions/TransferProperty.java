package org.wolftec.cwt.actions.gameactions;

import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionData;
import org.wolftec.cwt.actions.ActionType;
import org.wolftec.cwt.actions.UserInteractionData;
import org.wolftec.cwt.logic.TeamLogic;
import org.wolftec.cwt.model.ModelManager;

public class TransferProperty implements Action {

  private TeamLogic    team;
  private ModelManager model;

  @Override
  public String key() {
    return "transferProperty";
  }

  @Override
  public ActionType type() {
    return ActionType.PROPERTY_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return team.canTransferProperty(data.source.property);
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public void prepareMenu(UserInteractionData data) {
    team.getPropertyTransferTargets(data.source.property.owner, data);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.source.propertyId;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void invoke(ActionData data) {
    team.transferPropertyToPlayer(model.getProperty(data.p1), model.getPlayer(data.p2));
  }

}
