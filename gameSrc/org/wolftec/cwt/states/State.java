package org.wolftec.cwt.states;

import org.wolftec.cwt.input.InputData;

public interface State {

  default void init() {

  }

  default void exit() {

  }

  default void enter() {

  }

  default void update(int delta, InputData lastInput) {

  }

  default void render(int delta) {

  }
}
