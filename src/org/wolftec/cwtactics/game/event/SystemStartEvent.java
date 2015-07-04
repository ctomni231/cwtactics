package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.game.core.IEvent;

public interface SystemStartEvent extends IEvent {

  default void onSystemInitialized() {
  }

  default void onSystemStartup(Playground gameContainer) {
  }
}
