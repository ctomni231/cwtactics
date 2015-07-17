package org.wolftec.cwtactics.game.events.error;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface IllegalState extends SystemEvent {

  void onIllegalState(String message);
}
