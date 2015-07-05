package org.wolftec.cwtactics.game.event.error;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface IllegalState extends SystemEvent {

  void onIllegalState(String message);
}
