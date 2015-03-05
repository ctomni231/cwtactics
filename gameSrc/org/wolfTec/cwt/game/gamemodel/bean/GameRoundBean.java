package org.wolfTec.cwt.game.gamemodel.bean;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Template;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback3;
import org.stjs.javascript.functions.Callback4;
import org.stjs.javascript.functions.Function1;
import org.stjs.javascript.functions.Function4;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.gamemodel.model.GameMode;
import org.wolfTec.cwt.game.gamemodel.model.Player;
import org.wolfTec.cwt.game.gamemodel.model.PlayerObject;
import org.wolfTec.cwt.game.gamemodel.model.Property;
import org.wolfTec.cwt.game.gamemodel.model.Tile;
import org.wolfTec.cwt.game.gamemodel.model.Unit;
import org.wolfTec.cwt.game.gamemodel.model.WeatherType;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.functions.Function5;
import org.wolfTec.wolfTecEngine.util.ConvertUtility;

@ManagedComponent
public class GameRoundBean {

  private GameMapBean map;
  public int gameTimeLimit;
  public int gameTimeElapsed;
  public int turnTimeLimit;
  public int turnTimeElapsed;
  public Player lastClientPlayer;
  public Player turnOwner;
  public WeatherType weather;
  public int weatherLeftDays;
  public GameMode gameMode;
  public Array<Unit> units;
  public Array<Property> properties;
  public Array<Player> players;
  public int day = 0;
  public int mapWidth;
  public int mapHeight;

  public GameRoundBean() {
    map = new GameMapBean(EngineGlobals.MAX_MAP_WIDTH, EngineGlobals.MAX_MAP_HEIGHT);
    lastClientPlayer = null;
    setWeather(null);
    setWeatherLeftDays(0);
    day = 0;
    turnOwner = null;
    mapHeight = 0;
    mapWidth = 0;

    gameMode = GameMode.ADVANCE_WARS_1;

    units = JSCollections.$array();
    for (int i = 0, e = EngineGlobals.MAX_UNITS * EngineGlobals.MAX_PLAYER; i < e; i++)
      units.push(new Unit());

    properties = JSCollections.$array();
    for (int i = 0, e = EngineGlobals.MAX_PROPERTIES; i < e; i++)
      properties.push(new Property());

    players = JSCollections.$array();
    for (int i = 0; i < EngineGlobals.MAX_PLAYER; i++) {
      Player p = new Player();
      p.id = i;
      players.push(p);
    }

  }

  public Tile getTile(int x, int y) {
    return map.getTile(x, y);
  }

  /**
   * Returns an inactive **unit object** or **null** if every slot in the unit
   * list is used.
   *
   * @returns {*}
   */
  public Unit getInactiveUnit() {
    for (int i = 0, e = units.$length(); i < e; i++) {
      if (units.$get(i).owner == null) {
        return units.$get(i);
      }
    }
    return null;
  }

  /**
   * 
   * @param id
   * @return
   */
  public Player getPlayer(int id) {
    if (id < 0 || id >= players.$length()) {
      throw new Error("InvalidPlayerIdException");
    }

    return players.$get(id);
  }

  /**
   * 
   * @param id
   * @return
   */
  public Unit getUnit(int id) {
    if (id < 0 || id >= units.$length()) throw new Error("InvalidUnitIdException");
    return units.$get(id);
  }

  public int getMaxAmountOfUnits() {
    return units.$length();
  }

  /**
   * @param id
   * @returns {*}
   */
  public Property getProperty(int id) {
    if (id < 0 || id >= properties.$length()) throw new Error("InvalidPropertyIdException");
    return properties.$get(id);
  }

  public int getMaxAmountOfProperties() {
    return properties.$length();
  }

  /**
   * @param id
   */
  public boolean isValidUnitId(int id) {
    return (id >= 0 && id < units.$length());
  }

  /**
   * @param id
   */
  public boolean isValidPropertyId(int id) {
    return (id >= 0 && id < properties.$length());
  }

  /**
   * 
   * @param id
   * @return
   */
  public boolean isValidPlayerId(int id) {
    return (id >= 0 && id < players.$length());
  }

  /**
   * Returns true if the given position (x,y) is valid on the current active
   * map, else false.
   *
   * @param x
   * @param y
   */
  public boolean isValidPosition(int x, int y) {
    return (x >= 0 && y >= 0 && x < mapWidth && y < mapHeight);
  }

  /**
   * Returns true if the given player id is the current turn owner.
   *
   * @param player
   */
  public boolean isTurnOwner(Player player) {
    return turnOwner == player;
  }

  /**
   * @param obj
   */
  public boolean isTurnOwnerObject(PlayerObject obj) {
    return isTurnOwner(obj.getOwner());
  }

  /**
   * Converts a number of days into turns.
   *
   * @param days
   */
  public int convertDaysToTurns(int days) {
    return EngineGlobals.MAX_PLAYER * days;
  }

  /**
   * Returns `true` when at least two opposite teams are left, else `false`.
   */
  public boolean areEnemyTeamsLeft() {
    Player player;
    int foundTeam = EngineGlobals.INACTIVE_ID;
    int i = 0;
    int e = EngineGlobals.MAX_PLAYER;

    for (; i < e; i++) {
      player = players.$get(i);

      if (player.team != EngineGlobals.INACTIVE_ID) {

        // found alive player
        if (foundTeam == EngineGlobals.INACTIVE_ID) {
          foundTeam = player.team;
        } else if (foundTeam != player.team) {
          foundTeam = EngineGlobals.INACTIVE_ID;
          break;
        }
      }
    }

    return (foundTeam == EngineGlobals.INACTIVE_ID);
  }

  /**
   * Returns the **tile** which is occupied by a given **unit**.
   *
   * @param unit
   * @returns {*}
   */
  public Tile grabTileByUnit(Unit unit) {
    for (int x = 0, xe = mapWidth; x < xe; x++) {
      for (int y = 0, ye = mapHeight; y < ye; y++) {
        Tile tile = map.getTile(x, y);
        if (tile.unit == unit) {
          return tile;
        }
      }
    }

    throw new Error("UnknownGameObject");
  }

  /**
   * Returns the id of a property object
   */
  public int getPropertyId(Property property) {
    for (int i = 0, e = properties.$length(); i < e; i++) {
      if (properties.$get(i) == property) {
        return i;
      }
    }

    throw new Error("UnknownGameObject");
  }

  public int getDistance(int sx, int sy, int tx, int ty) {
    int dx = ConvertUtility.absInt(sx - tx);
    int dy = ConvertUtility.absInt(sy - ty);
    return dx + dy;
  }

  /**
   * @param property
   * @param cb
   * @param cbThis
   * @param arg
   */
  public void searchProperty(Property property, TileInRange dataBlock, Callback1<TileInRange> cb) {
    for (int x = 0, xe = mapWidth; x < xe; x++) {
      for (int y = 0, ye = mapHeight; y < ye; y++) {
        Tile tile = map.getTile(x, y);
        if (tile.property == property) {
          dataBlock.x = x;
          dataBlock.y = y;
          dataBlock.tile = tile;
          dataBlock.range = EngineGlobals.INACTIVE_ID;

          cb.$invoke(dataBlock);
        }
      }
    }

    dataBlock.x = 0;
    dataBlock.y = 0;
    dataBlock.tile = null;
    dataBlock.range = 0;
  }

  /**
   * Calls the callback on every tile.
   *
   * @param {Function} cb
   * @param {boolean} needsUnit the callback will be called only if there is a
   *        unit on it
   * @param {boolean} needsProperty the callback will be called only if there is
   *        a property on it
   * @param {Player} wantedOwner wanted owner of the property/unit
   */
  public void onEachTile(Callback3<Integer, Integer, Tile> cb, boolean needsUnit,
      boolean needsProp, Player wantedOwner) {
    for (int x = 0, xe = mapWidth; x < xe; x++) {
      for (int y = 0, ye = mapHeight; y < ye; y++) {
        Tile tile = map.getTile(x, y);

        if (needsUnit) {
          if (tile.unit == null || (wantedOwner != null && tile.unit.owner != wantedOwner)) {
            continue;
          }
        }

        if (needsProp) {
          if (tile.property == null
              || (wantedOwner != null && tile.property.getOwner() != wantedOwner)) {
            continue;
          }
        }

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
   * @param cbArg
   */
  public void doInRange(int x, int y, int range,
      Function5<Integer, Integer, Integer, Tile, Object, Boolean> cb, Object cbArg) {

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
        if (cb.$invoke(lX, lY, Math.abs(lX - x) + disY, map.getTile(hX, lY), cbArg) == false) {
          return;
        }
      }
    }
  }

  public void setWeatherLeftDays(int weatherLeftDays) {
    this.weatherLeftDays = weatherLeftDays;
  }

  public void setWeather(WeatherType weather) {
    this.weather = weather;
  }

}
