package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface OwnerEvent extends IEvent {

  void onUnitGetsPropertyOwner(String owner);
}
