package org.wolftec.cwtactics.game.event.actions;

import org.wolftec.cwtactics.game.IEvent;

public interface StealthEvents extends IEvent {

  default void onHideUnit(String unit) {
  }

  default void onUnhideUnit(String unit) {
  }
}
