package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.logic.TeamLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

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
  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag) {
    return propertyFlag != TileMeta.OWN && propertyFlag != TileMeta.EMPTY;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return team.canTransferMoney(data.source.property.owner, data.source.x, data.source.y);
  }

  @Override
  public void prepareActionMenu(UserInteractionData data) {
    team.getTransferMoneyTargets(data.source.property.owner, data);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.actor.id;
    actionData.p2 = interactionData.source.property.owner.id;
    actionData.p3 = interactionData.actionDataCode;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    team.transferMoney(model.getPlayer(data.p1), model.getPlayer(data.p2), data.p3);
  }
}
