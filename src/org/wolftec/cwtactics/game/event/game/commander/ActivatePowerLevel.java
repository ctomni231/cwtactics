package org.wolftec.cwtactics.game.event.game.commander;

import org.wolftec.cwtactics.game.components.game.PlayerCommander.PowerLevel;
import org.wolftec.cwtactics.game.core.SystemEvent;

public interface ActivatePowerLevel extends SystemEvent {
  void activatePowerLevel(String player, PowerLevel level);
}
