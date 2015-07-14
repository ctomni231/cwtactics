package org.wolftec.cwtactics.game.event.ui;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface InvokeAction extends SystemEvent {
  void invokeAction(String action, int x, int y, int tx, int ty);
}
