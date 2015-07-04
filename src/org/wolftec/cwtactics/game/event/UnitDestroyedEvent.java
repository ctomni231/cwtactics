package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnitDestroyedEvent extends SystemEvent {
  void onUnitDestroyed(String unitEntity);
}
