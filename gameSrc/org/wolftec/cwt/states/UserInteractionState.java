package org.wolftec.cwt.states;

import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.system.Maybe;

public interface UserInteractionState extends State {
  @Override
  default Maybe<Class<? extends State>> update(int delta, InputManager input) {
    return null;
  }
}
