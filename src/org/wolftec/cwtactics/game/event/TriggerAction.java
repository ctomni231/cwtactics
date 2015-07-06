package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface TriggerAction extends SystemEvent {
  default void onTriggerAction(String action) {

  }
}
