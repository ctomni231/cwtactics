package org.wolftec.cwt.controller.states.gameround;

import org.wolftec.cwt.controller.states.base.GameroundState;
import org.wolftec.cwt.controller.states.base.GameActionConstants;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.logic.BattleLogic;
import org.wolftec.cwt.view.input.InputService;

public class IngameShowAttackRangeState extends GameroundState {

  private UserInteractionData data;

  private BattleLogic attack;

  @Override
  public void onEnter(StateFlowData transition) {
    attack.fillRangeMap(data.source.unit, data.source.x, data.source.y, data.targets);
  }

  @Override
  public void onExit(StateFlowData transition) {
    data.targets.reset();
  }

  @Override
  public void update(StateFlowData transition, int delta, InputService input) {
    if (!input.isActionPressed(GameActionConstants.BUTTON_B)) {
      transition.setTransitionTo(transition.getPreviousState());
    }
  }
}
