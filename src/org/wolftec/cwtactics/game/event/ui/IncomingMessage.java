package org.wolftec.cwtactics.game.event.ui;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface IncomingMessage extends SystemEvent {
  void onIncomingMessage(String message);
}
