package org.wolftec.cwtactics.game.event.game.player;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface ChangeGold extends SystemEvent {
  void changeGold(String player, int amount);
}
