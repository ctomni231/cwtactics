package org.wolftec.cwtactics.game.event.system;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface ConfigUpdateEvent extends SystemEvent {
  void onConfigUpdate(String configName, boolean increaseValue);
}
