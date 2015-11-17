package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.model.Specialization;

public class Destroyable extends Specialization<Unit> {

  public void destroyUnit(int x, int y) {
    Tile tile = model.getTile(x, y);

    fog.removeUnitVision(x, y, tile.unit.owner);

    Player owner = tile.unit.owner;
    owner.numberOfUnits--;

    int unitId = model.getUnitId(tile.unit);
    model.forEachUnit((id, unit) -> {
      if (unit.loadedIn == unitId) {
        unit.owner = null;
      }
    });

    tile.unit.owner = null;
    tile.unit = null;

    if (noUnitsLeftLoose.value == 1 && owner.numberOfUnits == 0) {
      deactivatePlayer(owner);
    }
  }
}
