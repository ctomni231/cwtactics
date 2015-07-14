package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface PowerChanged extends SystemEvent {
  void powerChanged(String player, int currentPower);
}
