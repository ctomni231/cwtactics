package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface ObjectChangeTypeEvent extends IEvent {

  void onObjectGetsType(String type);

  void onObjectChangeType(String type);
}
