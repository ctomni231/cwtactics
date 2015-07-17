package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface ChangeGold extends SystemEvent {
  void changeGold(String player, int amount);
}
