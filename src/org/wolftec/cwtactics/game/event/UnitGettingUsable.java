package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface UnitGettingUsable extends SystemEvent {

  void onUnitGettingUsable(String unit);
}
