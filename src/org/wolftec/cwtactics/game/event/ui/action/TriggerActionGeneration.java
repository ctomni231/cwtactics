package org.wolftec.cwtactics.game.event.ui.action;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface TriggerActionGeneration extends SystemEvent {

  default void onTriggerActionGeneration(int x, int y) {

  }
}
