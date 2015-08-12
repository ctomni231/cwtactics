package org.wolftec.cwt.states.start;

import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.system.Maybe;

public class StartScreenState implements State {

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {
    return NO_TRANSITION;
  }
}
