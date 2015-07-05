package org.wolftec.cwtactics.game.event.system;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface IncomingMessage extends SystemEvent {
  void onIncomingMessage(String message);
}
