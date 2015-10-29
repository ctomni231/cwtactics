package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.logic.features.ExplodeLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

public class ExplodeUnit implements Action {

  private ExplodeLogic explode;
  private ModelManager model;

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
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    explode.explode(model, data.p1, data.p2, data.p3, data.p4);
  }

}
