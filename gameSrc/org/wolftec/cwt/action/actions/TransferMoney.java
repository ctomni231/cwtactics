package org.wolftec.cwt.action.actions;

import org.wolftec.cwt.action.Action;
import org.wolftec.cwt.action.ActionData;
import org.wolftec.cwt.action.ActionType;
import org.wolftec.cwt.action.TileMeta;
import org.wolftec.cwt.logic.LifecycleLogic;
import org.wolftec.cwt.logic.TeamLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.ui.UserInteractionData;

public class TransferMoney implements Action {

  private TeamLogic team;
  private ModelManager model;
  private LifecycleLogic life;

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
    return unitFlag == TileMeta.EMPTY && propertyFlag != TileMeta.OWN && propertyFlag != TileMeta.EMPTY;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return life.isCriticalProperty(data.target.property) && team.canTransferMoney(data.actor, data.target.property.owner);
  }

  @Override
  public void prepareActionMenu(UserInteractionData data) {
    team.getTransferMoneyTargets(data.actor, t -> data.addInfo(t + "", true));
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
