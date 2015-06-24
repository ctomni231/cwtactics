package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.IEvent;

public interface JoinEvents extends IEvent {
  default void onJoinUnits(String joiner, String joinTarget) {

  }
}
