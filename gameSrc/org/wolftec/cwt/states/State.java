package org.wolftec.cwt.states;

import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.input.InputData;

public interface State extends Injectable {

  default void init() {

  }

  default void exit() {

  }

  default void enter() {

  }

  default Class<? extends State> update(int delta, InputData lastInput) {
    return null;
  }

  default void render(int delta) {

  }
}
