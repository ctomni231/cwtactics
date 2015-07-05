package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface IncomingMessage extends SystemEvent {
  void onIncomingMessage(String message);
}
