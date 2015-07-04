package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface SpecialWeaponsEvents extends SystemEvent {

  default void onFireRocket(String silo, String firer, int tx, int ty) {
  }
}
