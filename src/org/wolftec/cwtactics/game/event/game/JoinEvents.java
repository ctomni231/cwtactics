package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface JoinEvents extends SystemEvent {
  default void onJoinUnits(String joiner, String joinTarget) {

  }
}
