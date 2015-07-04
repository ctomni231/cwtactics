package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface ExplodeEvents extends SystemEvent {
  default void onExplodeSelf(String unit) {

  }
}
