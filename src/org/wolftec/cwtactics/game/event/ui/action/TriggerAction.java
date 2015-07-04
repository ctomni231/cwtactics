package org.wolftec.cwtactics.game.event.ui.action;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface TriggerAction extends SystemEvent {
  default void onTriggerAction(String action) {

  }
}
