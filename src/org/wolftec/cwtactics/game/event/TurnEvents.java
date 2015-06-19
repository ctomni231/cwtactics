package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface TurnEvents extends IEvent {

  default void onTurnEnd() {

  }

  default void onTurnStart(String player, int turn) {

  }
}
