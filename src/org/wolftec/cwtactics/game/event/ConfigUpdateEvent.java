package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface ConfigUpdateEvent extends SystemEvent {
  void onConfigUpdate(String configName, boolean increaseValue);
}
