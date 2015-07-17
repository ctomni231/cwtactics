package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface UnitGettingUsable extends SystemEvent {

  void onUnitGettingUsable(String unit);
}
