package org.wolftec.cwtactics.game.event.game.lifecycle;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface UnitCreated extends SystemEvent {
  void onUnitCreated(String unitEntity);
}
