package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface ActivatePowerLevel extends SystemEvent {
  void activatePowerLevel(String player, PowerLevel level);
}
