package org.wolftec.cwtactics.game.event.game;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface FactoryEvents extends SystemEvent {

  default void onBuildUnit(String factory, String type) {
  }

  default void onUnitProduced(String unit, String type, int x, int y) {
  }
}
