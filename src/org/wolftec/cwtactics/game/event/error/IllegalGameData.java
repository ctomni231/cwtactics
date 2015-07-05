package org.wolftec.cwtactics.game.event.error;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface IllegalGameData extends SystemEvent {
  void onIllegalGameData(String message);
}
