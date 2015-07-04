package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.IEvent;

public interface UnitCreatedEvent extends IEvent {
  void unitCreatedEvent(String unitEntity);
}
