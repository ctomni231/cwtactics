package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface AddAction extends SystemEvent {

  default void addAction(String key, boolean enabled) {

  }
}
