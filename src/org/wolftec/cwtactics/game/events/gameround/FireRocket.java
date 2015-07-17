package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface FireRocket extends SystemEvent {
  void onFireRocket(String silo, String firer, int tx, int ty);
}
