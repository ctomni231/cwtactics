package org.wolftec.cwtactics.game.events.ui;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface IncomingMessage extends SystemEvent {
  void onIncomingMessage(String message);
}
