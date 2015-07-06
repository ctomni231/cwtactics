package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface IllegalArguments extends SystemEvent {
  void onIllegalArguments(String message);
}
