package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.IEvent;

public interface GameroundEvents extends IEvent {

  default void gameroundStartEvent() {
  }

  default void onGameroundEnds() {
  }
}
