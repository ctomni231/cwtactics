package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.system.Maybe;

public class IdleState implements State {

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {

    return NO_TRANSITION;
  }
}
