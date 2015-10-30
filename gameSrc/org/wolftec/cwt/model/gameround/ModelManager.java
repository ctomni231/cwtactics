package org.wolftec.cwt.model.gameround;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Callback3;
import org.stjs.javascript.functions.Function4;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.model.sheets.types.WeatherType;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.ListUtil;
import org.wolftec.wTec.config.ConfigurationProvider;
import org.wolftec.wTec.ioc.Injectable;

public class ModelManager implements Injectable, ConfigurationProvider {

  public Player lastClientPlayer;

  /**
   * The active weather type object.
   */
  public WeatherType weather;

  /**
   * The amount of days until the weather will be changed.
   */
  public int weatherLeftDays;

  /**
   * The current active day.
   */
  public int day;

  /**
   * The current active turn owner. Only the turn owner can do actions.
   */
  public Player turnOwner;

  /**
   * Maximum turn time limit in ms.
   */
  public int turnTimeLimit = 0;

  /**
   * Current elapsed turn time in ms.
   */
  public int turnTimeElapsed = 0;

  /**
   * Maximum game time limit in ms.
   * 
   */
  public int gameTimeLimit = 0;

  /**
   * Current elapsed game time in ms.
   */
  public int gameTimeElapsed = 0;

  public int mapWidth;

  public int mapHeight;

  /**
   * All player objects of a game round. This buffer holds the maximum amount of
   * possible player objects. Inactive ones are marked by the inactive marker as
   * team value.
   */
  private Array<Player> players;

  /**
   * All unit objects of a game round. This buffer holds the maximum amount of
   * possible unit objects. Inactive ones are marked by no reference in the map
   * and with an owner value **null**.
   */
  private Array<Unit> units;

  /**
   * All property objects of a game round. This buffer holds the maximum amount
   * of possible property objects. Inactive ones are marked by no reference in
   * the map.
   */
  private Array<Property> properties;

  private Array<Array<Tile>> map;

  @Override
  public void onConstruction() {
    players = ListUtil.instanceList(Player.class, Constants.MAX_PLAYER);
    properties = ListUtil.instanceList(Property.class, Constants.MAX_PROPERTIES);
    units = ListUtil.instanceList(Unit.class, Constants.MAX_PLAYER * Constants.MAX_UNITS);

    map = JSCollections.$array();

    for (int x = 0, xe = Constants.MAX_MAP_WIDTH; x < xe; x++) {
      map.push(JSCollections.$array());
      for (int y = 0, ye = Constants.MAX_MAP_HEIGHT; y < ye; y++) {
        map.$get(x).push(new Tile());
      }
    }

    ListUtil.forEachArrayValue(players, (i, player) -> player.id = i);
  }

  public Tile getTile(int x, int y) {
    if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) {
      JsUtil.throwError("InvalidMapPositionException");
    }

    return map.$get(x).$get(y);
  }

  /**
   * @param sx
   * @param sy
   * @param tx
   * @param ty
   * @return the distance bewteen the two positions
   */
  public int getDistance(int sx, int sy, int tx, int ty) {
    return Math.abs(sx - tx) + Math.abs(sy - ty);
  }

  /**
   * 
   * @param x
   * @param y
   * @return true if the given position (x,y) is valid on the current active
   *         map, else false
   */
  public boolean isValidPosition(int x, int y) {
    return (x >= 0 && y >= 0 && x < mapWidth && y < mapHeight);
  }

  public Player getPlayer(int id) {
    if (id < 0 || id >= players.$length()) {
      JsUtil.throwError("InvalidPlayerIdException");
    } // TODO

    return players.$get(id);
  }

  public boolean isValidPlayerId(int id) {
    return (id >= 0 && id < players.$length());
  }

  public Unit getUnit(int id) {
    if (id < 0 || id >= units.$length()) {
      JsUtil.throwError("InvalidUnitIdException");
    } // TODO

    return units.$get(id);
  }

  public int getUnitId(Unit unit) {
    return units.indexOf(unit);
  }

  public boolean isValidUnitId(int id) {
    return (id >= 0 && id < units.$length());
  }

  public Property getProperty(int id) {
    if (id < 0 || id > properties.$length()) {
      JsUtil.throwError("InvalidPropertyIdException");
    } // TODO

    return properties.$get(id);
  }

  public int getPropertyId(Property obj) {
    return properties.indexOf(obj);
  }

  public boolean isValidPropertyId(int id) {
    return (id >= 0 && id < properties.$length());
  }

  /**
   * 
   * @return true when at least two opposite teams are left, else false
   */
  public boolean areEnemyTeamsLeft() {
    Player player;
    int foundTeam = Constants.INACTIVE;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
      player = players.$get(i);

      if (player.team != -1) {

        // found alive player
        if (foundTeam == -1) {
          foundTeam = player.team;
        } else if (foundTeam != player.team) {
          foundTeam = -1;
          break;
        }
      }
    }

    return (foundTeam == -1);
  }

  public boolean isTurnOwnerObject(Unit obj) {
    return (obj.owner == turnOwner);
  }

  /**
   * 
   * @param player
   * @return true if the given player id is the current turn owner, else false
   */
  public boolean isTurnOwner(Player player) {
    return turnOwner == player;
  }

  /**
   * Converts a number of days into turns.
   * 
   * @param days
   * @return
   */
  public int convertDaysToTurns(int days) {
    return Constants.MAX_PLAYER * days;
  }

  /**
   * 
   * @param unit
   * @return **tile** which is occupied by a given **unit**.
   */
  public Tile grabTileByUnit(Unit unit) {
    for (int x = 0, xe = mapWidth; x < xe; x++) {
      for (int y = 0, ye = mapHeight; y < ye; y++) {
        Tile tile = map.$get(x).$get(y);
        if (tile.unit == unit) {
          return tile;
        }
      }
    }

    return null;
  }

  public void searchProperty(Property property, Callback3<Integer, Integer, Property> cb) {
    for (int x = 0, xe = mapWidth; x < xe; x++) {
      for (int y = 0, ye = mapHeight; y < ye; y++) {
        if (map.$get(x).$get(y).property == property) {
          cb.$invoke(x, y, property);
        }
      }
    }
  }

  public void searchUnit(Unit unit, Callback3<Integer, Integer, Unit> cb) {
    for (int x = 0, xe = mapWidth; x < xe; x++) {
      for (int y = 0, ye = mapHeight; y < ye; y++) {
        if (map.$get(x).$get(y).unit == unit) {
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

  public void forEachProperty(Callback2<Integer, Property> cb) {
    for (int i = 0; i < properties.$length(); i++) {
      cb.$invoke(i, properties.$get(i));
    }
  }

  public void forEachPlayer(Callback2<Integer, Player> cb) {
    for (int i = 0; i < players.$length(); i++) {
      cb.$invoke(i, players.$get(i));
    }
  }

  public void forEachTile(Callback3<Integer, Integer, Tile> cb) {
    for (int x = 0, xe = mapWidth; x < xe; x++) {
      for (int y = 0, ye = mapHeight; y < ye; y++) {
        cb.$invoke(x, y, map.$get(x).$get(y));
      }
    }
  }

  /**
   * Calls the callback on every tile.
   * 
   * @param cb
   * @param needsUnit
   *          the callback will be called only if there is a unit on it
   * @param needsProperty
   *          the callback will be called only if there is a property on it
   * @param wantedOwner
   *          wanted owner of the property/unit
   */
  public void onEachTile(Callback3<Integer, Integer, Tile> cb, boolean needsUnit, boolean needsProperty, Player wantedOwner) {
    for (int x = 0, xe = mapWidth; x < xe; x++) {
      for (int y = 0, ye = mapHeight; y < ye; y++) {
        Tile tile = map.$get(x).$get(y);

        if (needsUnit && (tile.unit == null || (wantedOwner != null && tile.unit.owner != wantedOwner))) continue;
        if (needsProperty && (tile.property == null || (wantedOwner != null && tile.property.owner != wantedOwner))) continue;

        cb.$invoke(x, y, tile);
      }
    }
  }

  /**
   * Invokes a callback on all tiles in a given range at a position (x,y).
   * 
   * @param x
   * @param y
   * @param range
   * @param cb
   * @param arg
   */
  public void doInRange(int x, int y, int range, Function4<Integer, Integer, Tile, Integer, Boolean> cb) {
    int lX;
    int hX;
    int lY = y - range;
    int hY = y + range;
    if (lY < 0) lY = 0;
    if (hY >= mapHeight) hY = mapHeight - 1;
    for (; lY <= hY; lY++) {

      int disY = Math.abs(lY - y);
      lX = x - range + disY;
      hX = x + range - disY;
      if (lX < 0) lX = 0;
      if (hX >= mapWidth) hX = mapWidth - 1;
      for (; lX <= hX; lX++) {

        // invoke the callback on all tiles in range
        // if a callback returns `false` then the process will be stopped
        if (cb.$invoke(lX, lY, getTile(lX, lY), Math.abs(lX - x) + disY) == false) {
          return;
        }
      }
    }
  }
}
