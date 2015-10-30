package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.logic.features.CommanderLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.util.AssertUtil;
import org.wolftec.cwt.wotec.action.Action;
import org.wolftec.cwt.wotec.action.ActionData;
import org.wolftec.cwt.wotec.action.ActionType;
import org.wolftec.cwt.wotec.state.StateFlowData;

public class ActivatePower implements Action {

  private ModelManager   model;
  private CommanderLogic co;

  @Override
  public String key() {
    return "activatePower";
  }

  @Override
  public ActionType type() {
    return ActionType.MAP_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return co.canActivatePower(data.actor, CommanderLogic.POWER_LEVEL_COP);
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public void prepareActionMenu(UserInteractionData data) {
    co.addActivatableLevelsToList(data.actor, data);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.actor.id;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void checkData(ActionData data) {
    AssertUtil.assertThat(model.isValidPlayerId(data.p1), "");
    AssertUtil.assertThat(co.isValidPowerlevel(data.p2), "");
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    co.activatePower(model.getPlayer(data.p1), data.p2);
  }

}
