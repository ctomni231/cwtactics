package org.wolftec.cwt.model.gameround;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Callback3;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.annotations.OptionalReturn;
import org.wolftec.cwt.core.collection.ListUtil;
import org.wolftec.cwt.model.sheets.types.UnitType;

public class Units {

  private final TileMap map;

  /**
   * All unit objects of a game round. This buffer holds the maximum amount of
   * possible unit objects. Inactive ones are marked by no reference in the map
   * and with an owner value **null**.
   */
  private Array<Unit> units;

  public Units(TileMap map) {
    this.map = map;
    units = ListUtil.instanceList(Unit.class, Constants.MAX_PLAYER * Constants.MAX_UNITS);
  }

  public Unit getUnit(int id) {
    AssertUtil.assertThatNot(id < 0 || id > units.$length());
    return units.$get(id);
  }

  public int getUnitId(Unit unit) {
    return units.indexOf(unit);
  }

  public boolean isValidUnitId(int id) {
    return (id >= 0 && id < units.$length());
  }

  public void dropUnitsOfPlayer(Player player) {
    for (int i = 0, e = Constants.MAX_UNITS * Constants.MAX_PLAYER; i < e; i++) {
      Unit unit = getUnit(i);
      if (unit.owner == player) {
        searchUnit(unit, (x, y, u) -> destroyUnit(x, y));
      }
    }
  }

  public void searchUnit(Unit unit, Callback3<Integer, Integer, Unit> cb) {
    for (int x = 0, xe = map.mapWidth; x < xe; x++) {
      for (int y = 0, ye = map.mapHeight; y < ye; y++) {
        if (map.map.$get(x).$get(y).unit == unit) {
          cb.$invoke(x, y, unit);
        }
      }
    }
  }

  public void forEachUnit(Callback2<Integer, Unit> cb) {
    for (int i = 0; i < units.$length(); i++) {
      cb.$invoke(i, units.$get(i));
    }
  }

  public boolean hasFreeUnitSlotLeft(Player player) {
    return player.numberOfUnits < Constants.MAX_UNITS;
  }

  @OptionalReturn
  public Unit getInactiveUnit() {
    for (int i = 0, e = Constants.MAX_UNITS * Constants.MAX_PLAYER; i < e; i++) {
      if (getUnit(i).owner == null) {
        return getUnit(i);
      }
    }
    return null;
  }

  public void createUnitAtPosition(int x, int y, Player player, String type) {
    Tile tile = model.getTile(x, y);
    Unit unit = createUnit(player, type);
    tile.unit = unit;
    fog.addUnitVision(x, y, player);
  }

  public Unit createUnitAsLoad(Unit transporter, Player player, String type) {
    Unit unit = createUnit(player, type);
    unit.loadedIn = getUnitId(transporter);
    return unit;
  }

  private Unit createUnit(Player player, String type) {
    Unit unit = getInactiveUnit();
    UnitType typeSheet = sheets.units.get(type);
    unit.owner = player;
    unit.type = typeSheet;
    unit.hp = 99;
    unit.exp = 0;
    unit.ammo = typeSheet.ammo;
    unit.fuel = typeSheet.fuel;
    unit.hidden = false;
    unit.loadedIn = Constants.INACTIVE;
    unit.canAct = false;
    player.numberOfUnits++;
    return unit;
  }

  public void destroyUnit(int x, int y) {
    Tile tile = map.getTile(x, y);

    fog.removeUnitVision(x, y, tile.unit.owner);

    Player owner = tile.unit.owner;
    owner.numberOfUnits--;

    int unitId = getUnitId(tile.unit);
    forEachUnit((id, unit) -> {
      if (unit.transport.loadedIn == unitId) {
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
