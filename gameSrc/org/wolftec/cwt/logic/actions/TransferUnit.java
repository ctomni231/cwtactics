package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.AssertUtil;
import org.wolftec.cwt.logic.features.TeamLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

public class TransferUnit implements Action {

  private TeamLogic team;
  private ModelManager model;

  @Override
  public String key() {
    return "transferUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return team.canTransferUnit(data.source.unit) && data.movePath.isEmpty();
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public void prepareActionMenu(UserInteractionData data) {
    team.getUnitTransferTargets(data.source.unit.owner, data);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.source.unitId;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void checkData(ActionData data) {
    AssertUtil.assertThat(model.isValidUnitId(data.p1), "");
    AssertUtil.assertThat(model.isValidPlayerId(data.p2), "");
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    team.transferUnitToPlayer(model.getUnit(data.p1), model.getPlayer(data.p2));
  }

}
