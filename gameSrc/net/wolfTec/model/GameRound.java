package net.wolfTec.model;

import net.wolfTec.Constants;
import net.wolfTec.CustomWarsTactics;
import net.wolfTec.enums.GameMode;
import net.wolfTec.types.WeatherType;
import net.wolfTec.utility.ObjectUtil;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback3;
import org.stjs.javascript.functions.Callback4;

public class GameRound {

    public Map map;

    public int gameTimeLimit;
    public int gameTimeElapsed;
    public int turnTimeLimit;
    public int turnTimeElapsed;

    public Player lastClientPlayer;

    /**
     * The current active turn owner. Only the turn owner can do actions.
     */
    public Player turnOwner;

    /**
     * The active weather type object.
     */
    public WeatherType weather;

    /**
     * The amount of days until the weather will be changed.
     */
    public int weatherLeftDays;

    /**
     * The current active commanders mode.
     */
    public GameMode gameMode;

    /**
     * All unit objects of a game round. This buffer holds the maximum amount of possible unit objects. Inactive
     * ones are marked by no reference in the map and with an owner value **null**.
     */
    public Array<Unit> units;

    /**
     * All property objects of a game round. This buffer holds the maximum amount of possible property objects.
     * Inactive ones are marked by no reference in the map.
     */
    public Array<Property> properties;

    /**
     * All player objects of a game round. This buffer holds the maximum amount of possible player objects. Inactive ones
     * are marked by the inactive marker as team value.
     */
    public Array<Player> players;

    /**
     * The current active day.
     */
    public int day = 0;

    public int mapWidth;

    public int mapHeight;

    public GameRound() {
        map = new Map(Constants.MAX_MAP_WIDTH, Constants.MAX_MAP_HEIGHT);
        lastClientPlayer = null;
        weather = null;
        weatherLeftDays = 0;
        day = 0;
        turnOwner = null;
        mapHeight = 0;
        mapWidth = 0;

        gameMode = GameMode.ADVANCE_WARS_1;

        units = JSCollections.$array();
        for (int i = 0, e = Constants.MAX_UNITS * Constants.MAX_PLAYER; i < e; i++) units.push(new Unit());

        properties = JSCollections.$array();
        for (int i = 0, e = Constants.MAX_PROPERTIES; i < e; i++) properties.push(new Property());

        players = JSCollections.$array();
        for (int i = 0; i < Constants.MAX_PLAYER; i++) {
            Player p = new Player();
            p.id = i;
            players.push(p);
        }
        
        
    }
    
    private org.stjs.javascript.Map<String, Config> configs;
    public Array<String> configNames;
    
    private void initConfig(){
    	configs = JSCollections.$map();

  		// game logic
  		configs.$put("fogEnabled", new Config(0, 1, 1, 1));
  		configs.$put("daysOfPeace", new Config(0, 50, 0, 1));
  		configs.$put("weatherMinDays", new Config(1, 5, 1, 1));
  		configs.$put("weatherRandomDays", new Config(0, 5, 4, 1));
  		configs.$put("round_dayLimit", new Config(0, 999, 0, 1));
  		configs.$put("noUnitsLeftLoose", new Config(0, 1, 0, 1));
  		configs.$put("autoSupplyAtTurnStart", new Config(0, 1, 1, 1));
  		configs.$put("unitLimit", new Config(0, Constants.MAX_UNITS, 0, 5));
  		configs.$put("captureLimit", new Config(0, Constants.MAX_PROPERTIES, 0, 1));
  		configs.$put("timer_turnTimeLimit", new Config(0, 60, 0, 1));
  		configs.$put("timer_gameTimeLimit", new Config(0, 99999, 0, 5));
  		configs.$put("co_getStarCost", new Config(100, 50000, 9000, 100));
  		configs.$put("co_getStarCostIncrease", new Config(0, 50000, 1800, 100));
  		configs.$put("co_getStarCostIncreaseSteps", new Config(0, 50, 10, 1));
  		configs.$put("co_enabledCoPower", new Config(0, 1, 1, 1));

  		// app config
  		configs.$put("fastClickMode", new Config(0, 1, 0, 1));
  		configs.$put("forceTouch", new Config(0, 1, 0, 1));
  		configs.$put("animatedTiles", new Config(0, 1, 1, 1));
  		
  		configNames = ObjectUtil.getProperties(configs);
    }
    
    public Config getCfg(String key) {
    	return configs.$get(key);
    }

    /**
     * Returns an inactive **unit object** or **null** if every slot in the unit list is used.
     *
     * @returns {*}
     */
    public Unit getInactiveUnit () {
        for (int i = 0, e = units.$length(); i < e; i++) {
            if (units.$get(i).owner == null) {
                return units.$get(i);
            }
        }
        return null;
    }

    public Player getPlayer(int id) {
        if (id < 0 || id >= players.$length()) {
            throw new Error("InvalidPlayerIdException");
        }

        return players.$get(id);
    }

    public Unit getUnit(int id) {
        if (id < 0 || id >= units.$length()) throw new Error("InvalidUnitIdException");
        return units.$get(id);
    }

    /**
     * @param id
     * @returns {*}
     */
    public Property getProperty(int id) {
        if (id < 0 || id >= properties.$length()) throw new Error("InvalidPropertyIdException");
        return properties.$get(id);
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

    public boolean isValidPlayerId(int id) {
        return (id >= 0 && id < players.$length());
    }

    /**
     * Returns true if the given position (x,y) is valid on the current active map, else
     * false.
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
        return Constants.MAX_PLAYER * days;
    }

    /**
     * Returns `true` when the game is in the peace phase.
     */
    public boolean inPeacePhase() {
        return (day < getCfg("daysOfPeace").getValue());
    }

    /**
     * Returns `true` when at least two opposite teams are left, else `false`.
     */
    public boolean areEnemyTeamsLeft() {
        Player player;
        int foundTeam = Constants.INACTIVE_ID;
        int i = 0;
        int e = Constants.MAX_PLAYER;

        for (; i < e; i++) {
            player = players.$get(i);

            if (player.team != Constants.INACTIVE_ID) {

                // found alive player
                if (foundTeam == Constants.INACTIVE_ID) {
                    foundTeam = player.team;
                } else if (foundTeam != player.team) {
                    foundTeam = Constants.INACTIVE_ID;
                    break;
                }
            }
        }

        return (foundTeam == Constants.INACTIVE_ID);
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

    ;

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

    ;

    /**
     * @param property
     * @param cb
     * @param cbThis
     * @param arg
     */
    public void searchProperty(Property property, cb, cbThis, arg) {
        for (int x = 0, xe = mapWidth; x < xe; x++) {
            for (int y = 0, ye = mapHeight; y < ye; y++) {
                if (map.getTile(x, y).property == property) {
                    cb.call(cbThis, x, y, property, arg);
                }
            }
        }
    }

    /**
     * Calls the callback on every tile.
     *
     * @param {Function} cb
     * @param {boolean}  needsUnit the callback will be called only if there is a unit on it
     * @param {boolean}  needsProperty the callback will be called only if there is a property on it
     * @param {Player}   wantedOwner wanted owner of the property/unit
     */
    public void onEachTile(Callback3<Integer, Integer, Tile> cb, boolean needsUnit, boolean needsProp, Player wantedOwner) {
        for (int x = 0, xe = mapWidth; x < xe; x++) {
            for (int y = 0, ye = mapHeight; y < ye; y++) {
                Tile tile = map.getTile(x, y);

                if (needsUnit ) {
                    if (tile.unit == null || (wantedOwner != null && tile.unit.getOwner() != wantedOwner)) {
                        continue;
                    }
                }

                if (needsProp){
                    if (tile.property == null || (wantedOwner != null && tile.property.getOwner() != wantedOwner)) {
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
                          Callback4<Integer, Integer, Tile, Integer> cb,
                          org.stjs.javascript.Map<String, ?> cbArg) {
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
                if (cb.$invoke(lX, lY, map.getTile(lX, lY), cbArg, Math.abs(lX - x) + disY) == false) return;

            }
        }
    }

}
