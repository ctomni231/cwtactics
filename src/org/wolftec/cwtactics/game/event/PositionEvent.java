package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.IEvent;

public interface PositionEvent extends IEvent {

  void onUnitPlacedAtProperty(String unit, String property);

  void onUnitPlacedAtTile(String unit, String tile);

  void onUnitPlacedAtPosition(String unit, int x, int y);
}
