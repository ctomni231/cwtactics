package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.controller.actions.core.ActionData;
import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.logic.BattleLogic;
import org.wolftec.cwt.model.gameround.GameroundEnder;
import org.wolftec.cwt.model.gameround.Unit;

public class AttackUnit implements AbstractAction {

  private BattleLogic battle;
  private GameroundEnder model;

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
    // TODO counter first ability
    Unit attacker = model.getUnit(data.p1);
    Unit defender = model.getUnit(data.p2);
    boolean indirectAttack = battle.isIndirect(attacker);
    battle.attack(attacker, defender, data.p3, data.p4);
  }

}
