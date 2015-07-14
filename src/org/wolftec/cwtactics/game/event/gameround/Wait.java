package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface Wait extends SystemEvent {

  void onWait(String unit);
}
