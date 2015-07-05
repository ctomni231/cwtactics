package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface PowerChanged extends SystemEvent {
  void powerChanged(String player, int currentPower);
}
