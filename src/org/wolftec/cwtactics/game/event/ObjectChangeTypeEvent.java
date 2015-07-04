package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.IEvent;

public interface ObjectChangeTypeEvent extends IEvent {

  void onObjectGetsType(String object, String type);
}
