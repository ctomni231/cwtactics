package org.wolftec.cwtactics.game.event.ui.action;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface InvokeAction extends SystemEvent {
  default void invokeAction(String action, int x, int y, int tx, int ty) {

  }
}
