package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface GameroundEvents extends IEvent {

  default void onGameroundStarts() {
  }

  default void onGameroundEnds() {
  }
}
