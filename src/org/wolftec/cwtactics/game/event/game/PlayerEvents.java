package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.IEvent;

public interface PlayerEvents extends IEvent {
  default void onChangeGold(String player, int amount) {

  }
}
