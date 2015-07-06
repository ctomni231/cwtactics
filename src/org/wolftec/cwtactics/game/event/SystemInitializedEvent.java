package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface SystemInitializedEvent extends SystemEvent {

  void onSystemInitialized();
}
