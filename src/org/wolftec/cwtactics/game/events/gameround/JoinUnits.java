package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface JoinUnits extends SystemEvent {
  void onJoinUnits(String joiner, String joinTarget);
}
