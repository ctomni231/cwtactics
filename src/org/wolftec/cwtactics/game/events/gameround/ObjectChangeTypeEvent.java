package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface ObjectChangeTypeEvent extends SystemEvent {

  void onObjectGetsType(String object, String type);
}
