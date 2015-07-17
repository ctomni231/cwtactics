package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface ActivatedPowerLevel extends SystemEvent {
  void onActivatedPowerLevel(String player, PowerLevel level);
}
