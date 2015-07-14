package org.wolftec.cwtactics.game.event.system;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface SystemInitializedEvent extends SystemEvent {

  void onSystemInitialized();
}
