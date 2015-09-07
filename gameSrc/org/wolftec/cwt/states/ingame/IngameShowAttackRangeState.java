package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.logic.BattleLogic;
import org.wolftec.cwt.states.AbstractIngameState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.states.UserInteractionData;

public class IngameShowAttackRangeState extends AbstractIngameState {

  private UserInteractionData data;

  private BattleLogic attack;

  @Override
  public void onEnter(StateTransition transition) {
    attack.fillRangeMap(data.source.unit, data.source.x, data.source.y, data.targets);
  }

  @Override
  public void onExit(StateTransition transition) {
    data.targets.reset();
  }

  @Override
  public void update(StateTransition transition, int delta) {
    if (!input.isActionPressed(GameActions.BUTTON_B)) {
      transition.setTransitionTo(transition.getPreviousState().get());
    }
  }
}
