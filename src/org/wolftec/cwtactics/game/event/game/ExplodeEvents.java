package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.IEvent;

public interface ExplodeEvents extends IEvent {
  default void onExplodeSelf(String unit) {

  }
}
