package org.wolftec.cwt.logic;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Player;
import org.wolftec.cwt.model.Property;
import org.wolftec.cwt.model.Tile;
import org.wolftec.cwt.model.Unit;
import org.wolftec.cwt.sheets.PropertyType;
import org.wolftec.cwt.system.MoveableMatrix;
import org.wolftec.cwt.system.Nullable;

public class CannonLogic implements Injectable {

  public static final String CANNON_UNIT_ID = "CANU";

  private ModelManager       model;

  /**
   * 
   * @param unit
   * @return **true** if a given **unit** is a cannon trigger unit, else
   *         **false**.
   */
  public boolean isCannonUnit(Unit unit) {
    return (unit.type.ID == CANNON_UNIT_ID);
  }

  //
  // Returns **true** when a cannon trigger unit is at a given position
  // (**x**,**y**) and has targets in it's range,
  // else **false**.
  //
  public boolean hasTargets(int x, int y, MoveableMatrix selection) {
    return isCannonUnit(model.getTile(x, y).unit) && markCannonTargets(x, y, selection);
  }

  public void fillCannonTargets(int x, int y, MoveableMatrix selection) {
    markCannonTargets(x, y, selection);
  }

  //
  // Fires a cannon at a given position.
  //
  public void fireCannon(int ox, int oy, int x, int y) {
    Unit target = model.getTile(x, y).unit;
    PropertyType type = grabBombPropTypeFromPos(ox, oy);

    target.takeDamage(Unit.pointsToHealth(type.cannon.damage), 9);
  }

  //
  // Marks all cannon targets in a selection. The area of fire will be defined
  // by
  // the rectangle from `sx,sy` to `tx,ty`. The cannon is on the tile `ox,oy`
  // with a given `range`.
  //
  public boolean tryToMarkCannonTargets(Player player, MoveableMatrix selection, int ox, int oy, int otx, int oty, int sx, int sy, int tx, int ty, int range) {
    int tid = player.team;
    int osy = sy;
    boolean result = false;
    for (; sx <= tx; sx++) {
      for (sy = osy; sy >= ty; sy--) {
        if (!model.isValidPosition(sx, sy)) continue;
        Tile tile = model.getTile(sx, sy);

        // range maybe don't match
        if ((Math.abs(sx - ox) + Math.abs(sy - oy)) > range) continue;
        if ((Math.abs(sx - otx) + Math.abs(sy - oty)) > range) continue;

        // in fog
        if (tile.visionTurnOwner <= 0) continue;

        Unit unit = tile.unit;
        if (Nullable.isPresent(unit)) {
          if (unit.owner.team != tid) {
            // TODO ugly !!!
            if (Nullable.isPresent(selection)) {
              selection.setValue(sx, sy, 1);
            } else {
              return true;
            }
            result = true;
          }
        }
      }
    }

    return result;
  }

  /**
   * Marks all cannon targets in a given selection model.
   * 
   * @param x
   * @param y
   * @param selection
   */
  public boolean markCannonTargets(int x, int y, MoveableMatrix selection) {
    Property prop = model.getTile(x, y).property;
    PropertyType type = (prop.type.ID != "PROP_INV") ? prop.type : grabBombPropTypeFromPos(x, y);

    selection.setCenter(x, y, Constants.INACTIVE);

    int otx = 0;
    int oty = 0;
    int sx = 0;
    int sy = 0;
    int tx = 0;
    int ty = 0;
    int max = type.cannon.range;
    int ox = x;
    int oy = y;
    switch (type.cannon.direction) {

      case "N":
        otx = x;
        oty = y - max - 1;
        sx = x - max + 1;
        sy = y - 1;
        tx = x + max - 1;
        ty = y - max;
        break;

      case "E":
        otx = x + max + 1;
        oty = y;
        sx = x + 1;
        sy = y + max - 1;
        tx = x + max;
        ty = y - max + 1;
        break;

      case "W":
        otx = x - max - 1;
        oty = y;
        sx = x - max;
        sy = y + max - 1;
        tx = x - 1;
        ty = y - max + 1;
        break;

      case "S":
        otx = x;
        oty = y + max + 1;
        sx = x - max + 1;
        sy = y + max;
        tx = x + max - 1;
        ty = y + 1;
        break;
    }

    return tryToMarkCannonTargets(model.getTile(x, y).unit.owner, selection, ox, oy, otx, oty, sx, sy, tx, ty, max);
  }

  public PropertyType grabBombPropTypeFromPos(int x, int y) {
    while (true) {
      Tile tile = model.getTile(x, y + 1);
      if (y + 1 < model.mapHeight && Nullable.isPresent(tile.property) && tile.property.type.ID == "INVU") {
        y++;
        continue;
      }

      break;
    }

    Tile tile = model.getTile(x, y);
    if (tile.property.type.ID != "INVU") {
      return tile.property.type;
    }

    while (true) {
      Tile stile = model.getTile(x + 1, y);
      if (x + 1 < model.mapWidth && Nullable.isPresent(stile.property) && stile.property.type.ID != "INVU") {
        return stile.property.type;
      }

      break;
    }

    // TODO error
    return null;
  }
}
