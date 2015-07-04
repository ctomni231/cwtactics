package org.wolftec.cwtactics.game.event.game.usability;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface Wait extends SystemEvent {

  void onWait(String unit);
}
