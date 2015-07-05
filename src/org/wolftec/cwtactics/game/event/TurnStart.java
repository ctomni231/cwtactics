package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface TurnStart extends SystemEvent {

  void onTurnStart(String player, int turn);
}
