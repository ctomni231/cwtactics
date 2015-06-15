package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface ConfigUpdateEvent extends IEvent {
  void onConfigUpdate(String configName, boolean increaseValue);
}
