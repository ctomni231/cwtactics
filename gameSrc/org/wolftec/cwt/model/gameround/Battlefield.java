package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.model.sheets.SheetDatabase;

public class Battlefield {

  public Player lastClientPlayer;

  public final TileMap map;
  public final Turns turns;
  public final Units units;
  public final Players players;
  public final TimeLimits limits;
  public final FloatingWeather weather;
  public final Properties properties;

  public Battlefield(SheetDatabase sheetDb) {
    turns = Specialization.constructSpecialization(Turns.class, this);
    map = new TileMap();
    units = new Units(map);
    properties = new Properties(sheetDb.properties);
    players = new Players(units, properties, this);
    limits = new TimeLimits();
    weather = new FloatingWeather(sheetDb.weathers);
  }

  /**
   * 
   * @param unit
   * @return **tile** which is occupied by a given **unit**.
   */
  public Tile grabTileByUnit(Unit unit) {
    for (int x = 0, xe = map.mapWidth; x < xe; x++) {
      for (int y = 0, ye = map.mapHeight; y < ye; y++) {
        Tile tile = map.map.$get(x).$get(y);
        if (tile.unit == unit) {
          return tile;
        }
      }
    }

    return null;
  }

  public void updatePositionData(PositionData data, int px, int py) {
    data.clean();

    data.x = px;
    data.y = py;
    data.tile = map.getTile(px, py);

    if (data.tile.visionTurnOwner > 0 && NullUtil.isPresent(data.tile.unit)) {
      data.unit = data.tile.unit;
      data.unitId = getUnitId(data.tile.unit);
    } else {
      data.unit = null;
    }

    if (NullUtil.isPresent(data.tile.property)) {
      data.property = data.tile.property;
      data.propertyId = getPropertyId(data.tile.property);
    } else {
      data.property = null;
    }
  }
}
