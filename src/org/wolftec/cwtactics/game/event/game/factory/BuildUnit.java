package org.wolftec.cwtactics.game.event.game.factory;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface BuildUnit extends SystemEvent {

  void onBuildUnit(String factory, String type);
}
