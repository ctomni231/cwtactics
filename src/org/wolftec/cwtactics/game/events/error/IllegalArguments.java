package org.wolftec.cwtactics.game.events.error;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface IllegalArguments extends SystemEvent {
  void onIllegalArguments(String message);
}
