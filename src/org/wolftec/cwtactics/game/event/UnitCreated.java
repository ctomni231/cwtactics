package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnitCreated extends SystemEvent {
  void onUnitCreated(String unitEntity);
}
