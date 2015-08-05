package org.wolftec.cwt.actions.gameactions;

import org.wolftec.cwt.actions.Action;
import org.wolftec.cwt.actions.ActionData;
import org.wolftec.cwt.actions.ActionType;
import org.wolftec.cwt.actions.UserInteractionData;
import org.wolftec.cwt.logic.ExplodeLogic;

public class ExplodeUnit implements Action {

  private ExplodeLogic explode;

  @Override
  public String key() {
    return "explode";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return explode.canSelfDestruct(data.source.unit);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.target.x;
    actionData.p2 = interactionData.target.y;
    actionData.p3 = explode.getSuicideRange(interactionData.source.unit);
    actionData.p4 = explode.getExplosionDamage(interactionData.source.unit);
  }

  @Override
  public void invoke(ActionData data) {
    explode.explode(data.p1, data.p2, data.p3, data.p4);
  }

}
