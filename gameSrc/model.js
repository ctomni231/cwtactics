/**
 * Contains all data of the game model.
 *
 * @module
 */

"use strict";

var daysOfPeaceCfg = require("./config").getConfig("daysOfPeace");
var createList = require("./system/functions").createListByClass;
var constants = require("./constants");
var assert = require("./system/functions").assert;
var matrix = require("./system/matrix");

exports.PositionData = require("./model/positionData").PositionData;
exports.Tile = require("./model/tile").Tile;
exports.Property = require("./model/property").Property;
exports.Player = require("./model/player").Player;
exports.Unit = require("./model/unit").Unit;

/**
 * Advance Wars 1 game mode. The first ever released game mode of the advance wars series (GBA and up).
 *
 * @constant
 */
exports.GAME_MODE_AW1 = 0;

/**
 * Advance Wars 2 game mode. It introduced the Super CO Power.
 *
 * @constant
 */
exports.GAME_MODE_AW2 = 1;

exports.lastClientPlayer = null;

/**
 * The active weather type object.
 *
 * @type {null}
 */
exports.weather = null;

/**
 * The amount of days until the weather will be changed.
 *
 * @type {number}
 */
exports.weatherLeftDays = 0;

/**
 * The current active commanders mode.
 *
 * @type {number}
 */
exports.gameMode = 0;

/**
 * The current active day.
 *
 * @type {number}
 */
exports.day = 0;

/**
 * The current active turn owner. Only the turn owner can do actions.
 *
 * @type {null}
 */
exports.turnOwner = null;

/**
 * Maximum turn time limit in ms.
 *
 * @type {number}
 */
exports.turnTimeLimit = 0;

/**
 * Current elapsed turn time in ms.
 *
 * @type {number}
 */
exports.turnTimeElapsed = 0;

/**
 * Maximum game time limit in ms.
 *
 * @type {number}
 */
exports.gameTimeLimit = 0;

/**
 * Current elapsed game time in ms.
 *
 * @type {number}
 */
exports.gameTimeElapsed = 0;

/**
 *
 * @type {number}
 */
exports.mapWidth = 0;

/**
 *
 * @type {number}
 */
exports.mapHeight = 0;

// generate map matrix
var matrix = new matrix.Matrix(constants.MAX_MAP_WIDTH, constants.MAX_MAP_HEIGHT);
var y, ye, x, xe;
for (x = 0, xe = constants.MAX_MAP_WIDTH; x < xe; x++) {
    for (y = 0, ye = constants.MAX_MAP_HEIGHT; y < ye; y++) {
        matrix.data[x][y] = new exports.Tile();
    }
}

/**
 *
 * @param x
 * @param y
 * @returns {*}
 */
exports.getTile = function (x, y) {
    if (x < 0 || x >= exports.mapWidth || y < 0 || y >= exports.mapHeight) {
        throw new Error("InvalidMapPositionException");
    }

    return matrix.data[x][y];
};

/**
 * All player objects of a game round. This buffer holds the maximum amount of possible player objects. Inactive ones
 * are marked by the inactive marker as team value.
 */
var players = createList(exports.Player, constants.MAX_PLAYER);

// set player id's
players.forEach(function (player, i) {
    player.id = i;
});

exports.getPlayer = function (id) {
    if (id < 0 || id > constants.MAX_PLAYER) {
        throw new Error("InvalidPlayerIdException");
    }

    return players[id];
};

var maxUnits = constants.MAX_PLAYER * constants.MAX_UNITS;

// All unit objects of a game round. This buffer holds the maximum amount of possible unit objects. Inactive
// ones are marked by no reference in the map and with an owner value **null**.
//
var units = createList(exports.Unit, maxUnits);

exports.getUnit = function (id) {
    if (id < 0 || id > maxUnits) {
        throw new Error("InvalidUnitIdException");
    }

    return units[id];
};

/**
 * All property objects of a game round. This buffer holds the maximum amount of possible property objects.
 * Inactive ones are marked by no reference in the map.
 */
var properties = createList(exports.Property, constants.MAX_PROPERTIES);

/**
 *
 * @param id
 * @returns {*}
 */
exports.getProperty = function (id) {
    if (id < 0 || id > constants.MAX_PROPERTIES) {
        throw new Error("InvalidPropertyIdException");
    }

    return properties[id];
};

/**
 *
 * @param id
 * @returns {boolean}
 */
exports.isValidUnitId = function (id) {
    return (id >= 0 && id < exports.units.size);
};

/**
 *
 * @param id
 * @returns {boolean}
 */
exports.isValidPropertyId = function (id) {
    return (id >= 0 && id < exports.properties.size);
};

exports.isValidPlayerId = function (id) {
    return (id >= 0 && id < exports.players.size);
};

//
// Returns the distance of two positions.
//
exports.getDistance = function (sx, sy, tx, ty) {
    if (this.DEBUG) assert(exports.isValidPosition(sx, sy));
    if (this.DEBUG) assert(exports.isValidPosition(tx, ty));

    return Math.abs(sx - tx) + Math.abs(sy - ty);
};

/**
 * Returns true if the given position (x,y) is valid on the current active map, else false.
 *
 * @param x
 * @param y
 * @returns {boolean}
 */
exports.isValidPosition = function (x, y) {
    return (x >= 0 && y >= 0 && x < exports.mapWidth && y < exports.mapHeight);
};

/**
 * Returns the **tile** which is occupied by a given **unit**.
 *
 * @param unit
 * @returns {*}
 */
exports.grabTileByUnit = function (unit) {
    for (var x = 0, xe = exports.mapWidth; x < xe; x++) {
        for (var y = 0, ye = exports.mapHeight; y < ye; y++) {
            var tile = exports.mapData[x][y];
            if (tile.unit === unit) {
                return tile;
            }
        }
    }

    assert(false, "given unit seems to be non-existent on the actual map");
    return null;
};

/**
 *
 * @param property
 */
exports.getPropertyId = function (property) {
    var i, e;
    for (i = 0, e = properties.length; i < e; i++) {
        if (properties[i] === property) {
            return i;
        }
    }

    throw new Error("UnknownGameObject");
};

/**
 *
 * @param property
 * @param cb
 * @param cbThis
 * @param arg
 */
exports.searchProperty = function (property, cb, cbThis, arg) {
    for (var x = 0, xe = exports.mapWidth; x < xe; x++) {
        for (var y = 0, ye = exports.mapHeight; y < ye; y++) {
            if (exports.mapData[x][y].property === property) {
                cb.call(cbThis, x, y, property, arg);
            }
        }
    }
};

/**
 *
 * @param unit
 * @param cb
 * @param cbThis
 * @param arg
 */
exports.searchUnit = function (unit, cb, cbThis, arg) {
    for (var x = 0, xe = exports.mapWidth; x < xe; x++) {
        for (var y = 0, ye = exports.mapHeight; y < ye; y++) {
            if (exports.mapData[x][y].unit === unit) {
                cb.call(cbThis, x, y, unit, arg);
            }
        }
    }
};

/**
 * Calls the callback on every tile.
 *
 * @param  {Function} cb
 * @param  {boolean}   needsUnit the callback will be called only if there is a unit on it
 * @param  {boolean}   needsProperty the callback will be called only if there is a property on it
 * @param  {Player}    wantedOwner wanted owner of the property/unit
 */
exports.onEachTile = function (cb, needsUnit, needsProperty, wantedOwner) {
    for (var x = 0, xe = exports.mapWidth; x < xe; x++) {
        for (var y = 0, ye = exports.mapHeight; y < ye; y++) {
            var tile = exports.mapData[x][y];

            if (needsUnit && (!tile.unit || (wantedOwner && tile.unit.owner !== wantedOwner))) continue;
            if (needsProperty && (!tile.property || (wantedOwner && tile.property.owner !== wantedOwner))) continue;

            cb(x, y, tile);
        }
    }
};

/**
 * Invokes a callback on all tiles in a given range at a position (x,y).
 *
 * @param x
 * @param y
 * @param range
 * @param cb
 * @param arg
 */
exports.doInRange = function (x, y, range, cb, arg) {
    if (constants.DEBUG) {
        assert(this.isValidPosition(x, y));
        assert(typeof cb === "function");
        assert(range >= 0);
    }

    var lX;
    var hX;
    var lY = y - range;
    var hY = y + range;
    if (lY < 0) lY = 0;
    if (hY >= exports.mapHeight) hY = exports.mapHeight - 1;
    for (; lY <= hY; lY++) {

        var disY = Math.abs(lY - y);
        lX = x - range + disY;
        hX = x + range - disY;
        if (lX < 0) lX = 0;
        if (hX >= exports.mapWidth) hX = exports.mapWidth - 1;
        for (; lX <= hX; lX++) {

            // invoke the callback on all tiles in range
            // if a callback returns `false` then the process will be stopped
            if (cb(lX, lY, exports.mapData[lX][lY], arg, Math.abs(lX - x) + disY) === false) return;

        }
    }
};

/**
 * Returns `true` when at least two opposite teams are left, else `false`.
 *
 * @returns {boolean}
 */
exports.areEnemyTeamsLeft = function () {
    var player;
    var foundTeam = -1;
    var i = 0;
    var e = constants.MAX_PLAYER;

    for (; i < e; i++) {
        player = this.players[i];

        if (player.team !== -1) {

            // found alive player
            if (foundTeam === -1) foundTeam = player.team;
            else if (foundTeam !== player.team) {
                foundTeam = -1;
                break;
            }
        }
    }

    return (foundTeam === -1);
};

/**
 * Returns true if the given player id is the current turn owner.
 *
 * @param player
 * @returns {boolean}
 */
exports.isTurnOwner = function (player) {
    return exports.turnOwner === player;
};

/**
 * Converts a number of days into turns.
 *
 * @param days
 * @returns {number}
 */
exports.convertDaysToTurns = function (days) {
    return constants.MAX_PLAYER * days;
};

/**
 * Returns `true` when the game is in the peace phase.
 *
 * @returns {boolean}
 */
exports.inPeacePhase = function () {
    return (exports.day < daysOfPeaceCfg.value);
};

/**
 *
 * @param obj
 * @returns {boolean}
 */
exports.isTurnOwnerObject = function (obj) {
    return (obj != null && obj.owner === exports.turnOwner);
};
