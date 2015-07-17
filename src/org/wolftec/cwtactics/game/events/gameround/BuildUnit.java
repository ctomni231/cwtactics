package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface BuildUnit extends SystemEvent {

  void onBuildUnit(String factory, String type);
}
