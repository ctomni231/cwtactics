package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.system.Option;

public class ShowAttackRangeState extends AbstractState {

  private Class<? extends AbstractState> idle;

  @Override
  public void onEnter(Option<Class<? extends AbstractState>> previous) {
    idle = previous.get();
  }

  @Override
  public void onExit() {
    idle = null;
  }

  @Override
  public Option<Class<? extends AbstractState>> update(int delta) {
    return input.isActionPressed(GameActions.BUTTON_B) ? NO_TRANSITION : Option.of(idle);
  }
}
