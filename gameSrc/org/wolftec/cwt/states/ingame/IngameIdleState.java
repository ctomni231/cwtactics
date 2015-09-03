package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.logic.BattleLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Unit;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;

public class IngameIdleState extends AbstractIngameState {

  private UserInteractionData data;
  private ModelManager        model;
  private BattleLogic         battle;

  @Override
  public void onEnter(StateTransition transition) {
    data.source.clean();
    data.target.clean();
    data.actionTarget.clean();
  }

  @Override
  public void handleButtonA(StateTransition transition, int delta) {
    data.source.set(model, input.lastX, input.lastY);
    data.target.set(model, input.lastX, input.lastY);
    transition.setTransitionTo(IngameMovepathSelectionState.class);
  }

  @Override
  public void handleButtonB(StateTransition transition, int delta) {
    data.source.set(model, input.lastX, input.lastY);
    Unit sourceUnit = data.source.unit;
    if (sourceUnit != null && (battle.hasMainWeapon(sourceUnit) || battle.hasSecondaryWeapon(sourceUnit))) {
      transition.setTransitionTo(IngameShowAttackRangeState.class);
    }
  }
}