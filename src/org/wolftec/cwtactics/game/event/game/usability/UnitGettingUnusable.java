package org.wolftec.cwtactics.game.event.game.usability;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnitGettingUnusable extends SystemEvent {

  void onUnitGettingUnusable(String unit);
}
