package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface OwnerChangeEvent extends SystemEvent {

  void onUnitGetsPropertyOwner(String unit, String factory);
}
