package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.core.input.InputProvider;
import org.wolftec.cwt.core.state.AbstractIngameState;
import org.wolftec.cwt.core.state.GameActions;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.logic.BattleLogic;
import org.wolftec.cwt.states.UserInteractionData;

public class IngameShowAttackRangeState extends AbstractIngameState {

  private UserInteractionData data;

  private BattleLogic attack;

  @Override
  public void onEnter(StateFlowData transition) {
    attack.fillRangeMap(data.source.unit.get(), data.source.x, data.source.y, data.targets);
  }

  @Override
  public void onExit(StateFlowData transition) {
    data.targets.reset();
  }

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    if (!input.isActionPressed(GameActions.BUTTON_B)) {
      transition.setTransitionTo(transition.getPreviousState().get());
    }
  }
}
