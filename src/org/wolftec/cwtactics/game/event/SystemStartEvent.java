package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.game.core.SystemEvent;

public interface SystemStartEvent extends SystemEvent {

  default void onSystemInitialized() {
  }

  default void onSystemStartup(Playground gameContainer) {
  }
}
