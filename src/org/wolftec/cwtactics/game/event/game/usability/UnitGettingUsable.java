package org.wolftec.cwtactics.game.event.game.usability;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnitGettingUsable extends SystemEvent {

  void onUnitGettingUsable(String unit);
}
