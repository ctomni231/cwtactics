package org.wolftec.cwtactics.game.event.actions;

import org.wolftec.cwtactics.game.IEvent;
import org.wolftec.cwtactics.game.components.PlayerCommander.PowerLevel;

public interface CommanderEvents extends IEvent {
  default void onActivatePowerLevel(String player, PowerLevel level) {
  }

  default void onChangePower(String player, int amount) {

  }

  default void onPowerChanged(String player, int currentPower) {

  }
}
