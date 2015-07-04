package org.wolftec.cwtactics.game.event.game.turn;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface TurnEnd extends SystemEvent {

  void onTurnEnd(String player);
}
