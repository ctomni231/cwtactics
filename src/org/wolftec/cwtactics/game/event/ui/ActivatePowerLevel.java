package org.wolftec.cwtactics.game.event.ui;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;
import org.wolftec.cwtactics.game.event.gameround.PowerLevel;

public interface ActivatePowerLevel extends SystemEvent {
  void activatePowerLevel(String player, PowerLevel level);
}
