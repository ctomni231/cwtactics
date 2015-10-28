package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.logic.BattleLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;

public class AttackUnit implements Action {

  private BattleLogic battle;
  private ModelManager model;

  @Override
  public String key() {
    return "attack";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(UserInteractionData data) {
    return !battle.inPeacePhase() && battle.hasTargets(data.source.unit, data.target.x, data.target.y, !data.movePath.isEmpty());
  }

  @Override
  public void prepareTargets(UserInteractionData data) {
    battle.calculateTargets(data.source.unit, data.target.x, data.target.y, data.targets, false);
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.source.unitId;
    actionData.p2 = interactionData.actionTarget.unitId;
    actionData.p3 = battle.getBattleLuck();
    actionData.p4 = battle.getBattleLuck();
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    battle.attack(model.getUnit(data.p1), model.getUnit(data.p2), data.p3, data.p4);
  }

}
