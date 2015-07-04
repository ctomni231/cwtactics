package org.wolftec.cwtactics.game.event.game.turn;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface ClientEndsTurn extends SystemEvent {

  void onClientEndsTurn();
}
