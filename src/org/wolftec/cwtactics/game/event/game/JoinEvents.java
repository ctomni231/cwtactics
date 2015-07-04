package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.IEvent;

public interface JoinEvents extends IEvent {
  default void onJoinUnits(String joiner, String joinTarget) {

  }
}
