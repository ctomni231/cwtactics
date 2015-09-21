package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.logic.TeamLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

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
    return team.canTransferProperty(data.source.property.get());
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public void prepareActionMenu(UserInteractionData data) {
    team.getPropertyTransferTargets(data.source.property.get().owner, data);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.source.propertyId;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void evaluateByData(int delta, ActionData data) {
    team.transferPropertyToPlayer(model.getProperty(data.p1), model.getPlayer(data.p2));
  }

}
