package org.wolftec.cwt.states.actions;

import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionData;
import org.wolftec.cwt.actions.ActionType;
import org.wolftec.cwt.actions.UserInteractionData;
import org.wolftec.cwt.logic.HideLogic;
import org.wolftec.cwt.model.ModelManager;

public class UnhideUnit implements Action {

  private HideLogic    hide;
  private ModelManager model;

  @Override
  public String key() {
    return "unitUnhide";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.source.unitId;
  }

  @Override
  public void invoke(ActionData data) {
    hide.unhide(model.getUnit(data.p1));
  }

}
