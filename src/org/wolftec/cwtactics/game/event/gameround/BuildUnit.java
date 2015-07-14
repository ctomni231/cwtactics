package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface BuildUnit extends SystemEvent {

  void onBuildUnit(String factory, String type);
}
