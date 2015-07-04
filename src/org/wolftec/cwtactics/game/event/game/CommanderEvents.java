package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.components.game.PlayerCommander.PowerLevel;
import org.wolftec.cwtactics.game.core.IEvent;

public interface CommanderEvents extends IEvent {
  default void activatePowerLevel(String player, PowerLevel level) {
  }

  default void changePower(String player, int amount) {

  }

  default void powerChanged(String player, int currentPower) {

  }
}
