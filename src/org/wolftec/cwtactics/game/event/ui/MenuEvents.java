package org.wolftec.cwtactics.game.event.ui;

import org.wolftec.cwtactics.game.IEvent;

public interface MenuEvents extends IEvent {
  default void onBuildActions(int x, int y, String tile, String property, String unit) {

  }

  default void onAddMenuEntry(String key, boolean enabled) {

  }
}
