package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.logic.TeamLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UserInteractionData;

public class TransferUnit implements Action {

  private TeamLogic    team;
  private ModelManager model;

  @Override
  public String key() {
    return "transferUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  // TODO relation: ["S", "T", relation.RELATION_SAME_THING],

  @Override
  public boolean condition(UserInteractionData data) {
    return team.canTransferUnit(data.source.unit.get());
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public void prepareActionMenu(UserInteractionData data) {
    team.getUnitTransferTargets(data.source.unit.get().owner, data);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.source.unitId;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    team.transferUnitToPlayer(model.getUnit(data.p1), model.getPlayer(data.p2));
  }

}
