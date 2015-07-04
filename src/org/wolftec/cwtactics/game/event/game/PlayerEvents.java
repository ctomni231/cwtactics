package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface PlayerEvents extends SystemEvent {
  default void changeGold(String player, int amount) {

  }
}
