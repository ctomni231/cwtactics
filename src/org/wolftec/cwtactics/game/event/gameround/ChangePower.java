package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface ChangePower extends SystemEvent {
  void changePower(String player, int amount);
}
