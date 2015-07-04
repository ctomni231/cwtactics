package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnitCreatedEvent extends SystemEvent {
  void unitCreatedEvent(String unitEntity);
}
