package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface TurnStart extends SystemEvent {

  void onTurnStart(String player, int turn);
}
