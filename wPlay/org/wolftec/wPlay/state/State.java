package org.wolftec.wPlay.state;

import org.wolftec.wPlay.input.LiveInputManager;

public interface State {

  default boolean isAnimationState() {
    return false; // TODO maybe without that -> inheritance solution possible ?
  }

  default void exit(StateManager stm) {
  }

  default void enter(StateManager stm) {
  }

  default void update(StateManager stm, LiveInputManager input, int delta) {

  }

  default void render(int delta) {
  }
}
