package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.IEvent;

public interface ErrorEvent extends IEvent {
  default void onIllegalGameData(String message) {
  }

  default void onIllegalArguments(String message) {
  }

  default void onIllegalState(String message) {
  }
}
