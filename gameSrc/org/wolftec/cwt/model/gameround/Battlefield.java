package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.NullUtil;

public class Battlefield {

  public Player lastClientPlayer;

  public final TileMap map;
  public final Units units;
  public final Properties properties;
  public final Players players;
  public final TimeLimits limits;
  public final FloatingWeather weather;
  public final Turns turns;

  public Battlefield() {
    turns = new Turns();
    map = new TileMap();
    units = new Units();
    properties = new Properties();
    players = new Players();
    limits = new TimeLimits();
    weather = new FloatingWeather();
  }

  public void updatePositionData(PositionData data, int px, int py) {
    data.clean();

    data.x = px;
    data.y = py;
    data.tile = map.getTile(px, py);

    if (data.tile.data.visionTurnOwner > 0 && NullUtil.isPresent(data.tile.unit)) {
      data.unit = data.tile.unit;
      data.unitId = units.getUnitId(data.tile.unit);
    } else {
      data.unit = null;
    }

    if (NullUtil.isPresent(data.tile.property)) {
      data.property = data.tile.property;
      data.propertyId = properties.getPropertyId(data.tile.property);
    } else {
      data.property = null;
    }
  }
}
