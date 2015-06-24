package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.IEvent;

public interface SpecialWeaponsEvents extends IEvent {

  default void onFireRocket(String silo, String firer, int tx, int ty) {
  }
}
