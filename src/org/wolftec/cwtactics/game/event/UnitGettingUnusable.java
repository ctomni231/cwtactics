package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface UnitGettingUnusable extends SystemEvent {

  void onUnitGettingUnusable(String unit);
}
