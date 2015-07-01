package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.IEvent;

public interface PlayerEvents extends IEvent {
  default void changeGold(String player, int amount) {

  }
}
