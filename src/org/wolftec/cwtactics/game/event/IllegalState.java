package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface IllegalState extends SystemEvent {

  void onIllegalState(String message);
}
