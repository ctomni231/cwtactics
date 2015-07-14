package org.wolftec.cwtactics.game.event.ui;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface TriggerActionGeneration extends SystemEvent {

  default void onTriggerActionGeneration(int x, int y) {

  }
}
