package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface JoinUnits extends SystemEvent {
  void onJoinUnits(String joiner, String joinTarget);
}
