package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface GameroundEvents extends SystemEvent {

  default void gameroundStartEvent() {
  }

  default void onGameroundEnds() {
  }
}
