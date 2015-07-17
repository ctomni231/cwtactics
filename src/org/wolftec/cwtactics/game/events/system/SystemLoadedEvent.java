package org.wolftec.cwtactics.game.events.system;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface SystemLoadedEvent extends SystemEvent {
  void onSystemLoaded();
}
