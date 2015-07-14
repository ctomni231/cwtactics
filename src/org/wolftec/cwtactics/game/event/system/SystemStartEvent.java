package org.wolftec.cwtactics.game.event.system;

import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface SystemStartEvent extends SystemEvent {

  void onSystemStartup(Playground gameContainer);
}
