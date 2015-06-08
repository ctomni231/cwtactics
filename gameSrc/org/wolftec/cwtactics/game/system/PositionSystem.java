package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.PositionComponent;
import org.wolftec.cwtactics.game.event.PositionEvent;

public class PositionSystem implements ISystem, PositionEvent {

  @Override
  public void onUnitPlacedAtProperty(String unit, String property) {
    PositionComponent pos = gec(property, PositionComponent.class);
    onUnitPlacedAtPosition(unit, pos.x, pos.y);
  }

  @Override
  public void onUnitPlacedAtTile(String unit, String tile) {
    // TODO
  }

  @Override
  public void onUnitPlacedAtPosition(String unit, int x, int y) {
    PositionComponent unitPos = gogec(unit, PositionComponent.class);
    unitPos.x = x;
    unitPos.x = y;
  }
}
