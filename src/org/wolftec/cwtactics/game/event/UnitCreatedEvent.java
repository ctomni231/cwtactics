package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface UnitCreatedEvent extends IEvent {
  void unitCreatedEvent(String unitEntity);
}
