package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface UnitDestroyedEvent extends IEvent {
  void onUnitDestroyed(String unitEntity);
}
