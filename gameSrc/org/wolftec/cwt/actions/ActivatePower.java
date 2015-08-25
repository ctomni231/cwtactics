package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.logic.CommanderLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

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
  public void prepareMenu(UserInteractionData data) {
    // TODO
    data.addInfo("cop", false);
    if (co.canActivatePower(data.actor, CommanderLogic.POWER_LEVEL_SCOP)) {
      data.addInfo("scop", false);
    }
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.actor.id;
    actionData.p2 = interactionData.actionDataCode;
  }

  @Override
  public void evaluateByData(int delta, ActionData data) {
    co.activatePower(model.getPlayer(data.p1), data.p2);
  }

}
