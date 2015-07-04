package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.IEvent;

public interface TurnEvents extends IEvent {

  default void onClientEndsTurn() {

  }

  default void onTurnEnd(String player) {

  }

  default void onTurnStart(String player, int turn) {

  }

  default void onDayStart(int day) {

  }
}
