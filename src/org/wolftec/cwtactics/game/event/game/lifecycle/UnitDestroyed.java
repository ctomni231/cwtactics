package org.wolftec.cwtactics.game.event.game.lifecycle;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnitDestroyed extends SystemEvent {
  void onUnitDestroyed(String unitEntity);
}
