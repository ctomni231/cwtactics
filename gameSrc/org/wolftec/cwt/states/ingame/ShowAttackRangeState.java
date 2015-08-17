package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.system.Maybe;

public class ShowAttackRangeState implements State {

  private Class<? extends State> idle;

  @Override
  public void onEnter(Maybe<Class<? extends State>> previous) {
    idle = previous.get();
  }

  @Override
  public void onExit() {
    idle = null;
  }

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {
    return input.isActionPressed(GameActions.BUTTON_B) ? NO_TRANSITION : Maybe.of(idle);
  }
}
