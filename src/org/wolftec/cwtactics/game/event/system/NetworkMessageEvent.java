package org.wolftec.cwtactics.game.event.system;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface NetworkMessageEvent extends SystemEvent {
  public void onIncomingMessage(String message);
}
