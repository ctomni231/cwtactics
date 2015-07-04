package org.wolftec.cwtactics.game.event.game.commander;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface ChangePower extends SystemEvent {
  void changePower(String player, int amount);
}
