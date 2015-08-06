package org.wolftec.cwt.states.actions;

import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionData;
import org.wolftec.cwt.actions.ActionType;
import org.wolftec.cwt.actions.UserInteractionData;
import org.wolftec.cwt.logic.TeamLogic;
import org.wolftec.cwt.model.ModelManager;

public class TransferMoney implements Action {

  private TeamLogic    team;
  private ModelManager model;

  @Override
  public String key() {
    return "transferMoney";
  }

  @Override
  public ActionType type() {
    return ActionType.MAP_ACTION;
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return team.canTransferMoney(data.source.property.owner, data.source.x, data.source.y);
  }

  @Override
  public void prepareMenu(UserInteractionData data) {
    team.getTransferMoneyTargets(data.source.property.owner, data);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.actor.id;
    actionData.p2 = interactionData.source.property.owner.id;
    actionData.p3 = interactionData.actionDataCode;
  }

  @Override
  public void invoke(ActionData data) {
    team.transferMoney(model.getPlayer(data.p1), model.getPlayer(data.p2), data.p3);
  }
}
