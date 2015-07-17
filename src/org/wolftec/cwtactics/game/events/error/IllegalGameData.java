package org.wolftec.cwtactics.game.events.error;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface IllegalGameData extends SystemEvent {
  void onIllegalGameData(String message);
}
