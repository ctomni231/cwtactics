package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface GameroundEnd extends SystemEvent {
  void onGameroundEnd();
}
