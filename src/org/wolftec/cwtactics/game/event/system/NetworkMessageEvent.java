package org.wolftec.cwtactics.game.event.system;

import org.wolftec.cwtactics.game.core.IEvent;

public interface NetworkMessageEvent extends IEvent {
  public void onIncomingMessage(String message);
}
