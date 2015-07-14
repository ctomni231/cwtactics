package org.wolftec.cwtactics.game.event.ui;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface AddAction extends SystemEvent {
  void onAddAction(String key, boolean enabled);
}
