package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface InvokeAction extends SystemEvent {
  default void invokeAction(String action, int x, int y, int tx, int ty) {

  }
}
