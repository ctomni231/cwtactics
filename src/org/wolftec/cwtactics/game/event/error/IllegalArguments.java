package org.wolftec.cwtactics.game.event.error;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface IllegalArguments extends SystemEvent {
  void onIllegalArguments(String message);
}
