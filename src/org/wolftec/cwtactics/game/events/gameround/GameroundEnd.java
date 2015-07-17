package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface GameroundEnd extends SystemEvent {
  void onGameroundEnd();
}
