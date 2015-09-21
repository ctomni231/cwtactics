package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.logic.ExplodeLogic;
import org.wolftec.cwt.states.UserInteractionData;

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
    return explode.canSelfDestruct(data.source.unit.get());
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.target.x;
    actionData.p2 = interactionData.target.y;
    actionData.p3 = explode.getSuicideRange(interactionData.source.unit.get());
    actionData.p4 = explode.getExplosionDamage(interactionData.source.unit.get());
  }

  @Override
  public void evaluateByData(int delta, ActionData data) {
    explode.explode(data.p1, data.p2, data.p3, data.p4);
  }

}
