package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface StealthEvents extends SystemEvent {

  default void onHideUnit(String unit) {
  }

  default void onUnhideUnit(String unit) {
  }
}
