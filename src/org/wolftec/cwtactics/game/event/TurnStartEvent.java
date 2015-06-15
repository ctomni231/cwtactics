package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface TurnStartEvent extends IEvent {
  void onTurnStart(String player, int turn);
}
