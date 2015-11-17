package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.controller.actions.core.ActionData;
import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.logic.TeamLogic;
import org.wolftec.cwt.model.gameround.GameroundEnder;

public class TransferProperty implements AbstractAction {

  private TeamLogic team;
  private GameroundEnder model;

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
  public void prepareActionMenu(UserInteractionData data) {
    team.getPropertyTransferTargets(data.source.property.owner, t -> data.addInfo(t + "", true));
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.source.propertyId;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void checkData(ActionData data) {
    AssertUtil.assertThat(model.isValidPropertyId(data.p1), "");
    AssertUtil.assertThat(model.isValidPlayerId(data.p2), "");
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    team.transferPropertyToPlayer(model.getProperty(data.p1), model.getPlayer(data.p2));
  }

}
