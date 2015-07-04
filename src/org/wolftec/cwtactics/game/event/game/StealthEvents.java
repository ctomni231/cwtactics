package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.IEvent;

public interface StealthEvents extends IEvent {

  default void onHideUnit(String unit) {
  }

  default void onUnhideUnit(String unit) {
  }
}
