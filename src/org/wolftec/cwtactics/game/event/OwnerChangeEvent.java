package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface OwnerChangeEvent extends IEvent {

  void onUnitGetsPropertyOwner(String unit, String factory);
}
