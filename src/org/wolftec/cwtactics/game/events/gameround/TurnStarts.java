package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface TurnStarts extends SystemEvent {

  void onTurnStarts(String player, int turn);
}
