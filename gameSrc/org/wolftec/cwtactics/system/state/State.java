package org.wolftec.cwtactics.system.state;

import org.wolftec.cwtactics.system.input.InputManager;

public interface State {
  
  default boolean isAnimationState() {
    return false; // TODO maybe without that -> inheritance solution possible ?
  }

  default void exit(StateManager stm) {
  }

  default void enter(StateManager stm) {
  }

  default void update(StateManager stm, InputManager input, int delta) {
    
  }

  default void render(int delta) {
  }
}
