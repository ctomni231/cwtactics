package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface IllegalGameData extends SystemEvent {
  void onIllegalGameData(String message);
}
