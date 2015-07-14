package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface OwnerChangeEvent extends SystemEvent {

  void onUnitGetsPropertyOwner(String unit, String factory);
}
