package org.wolftec.cwtactics.game.event.error;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface IllegalState extends SystemEvent {

  void onIllegalState(String message);
}
