"use strict";

var commanders = require("./sheets/commanderDatabase").db;
var units = require("./sheets/unitDatabase").db;
var tiles = require("./sheets/tileDatabase").db;
var properties = require("./sheets/propertyDatabase").db;
var armies = require("./sheets/armyDatabase").db;
var movetypes = require("./sheets/sheetDatabase").db;
var weathers = require("./sheets/weatherDatabase").db;

/**
 * Holds the default weather type.
 */
var defaultWeather = null;

/**
 *
 * @param type
 * @returns {SheetDatabaseObject}
 */
var getSheetDB = function (type) {
    if (type < exports.TYPE_UNIT || type > exports.TYPE_MOVETYPE) {
        throw new Error("IllegalSheetTypeException");
    }

    switch (type) {
        case exports.TYPE_UNIT:
            return units;

        case exports.TYPE_TILE:
            return tiles;

        case exports.TYPE_PROPERTY:
            return properties;

        case exports.TYPE_WEATHER:
            return weathers;

        case exports.TYPE_COMMANDER:
            return commanders;

        case exports.TYPE_MOVETYPE:
            return movetypes;

        case exports.TYPE_ARMY:
            return armies;
    }
};

/* ------------------------------------- Registers some basic types here ------------------------------------- */

movetypes.registerSheet({
    "ID": "NO_MOVE",
    "sound": null,
    "costs": {
        "*": -1
    }
});

properties.registerSheet({
    "ID": exports.PROP_INV,
    "defense": 0,
    "vision": 0,
    "capturePoints": 1,
    "blocker": true,
    "assets": {}
});

units.registerSheet({
    "ID": exports.CANNON_UNIT_INV,
    "cost": -1,
    "range": 0,
    "movetype": "NO_MOVE",
    "vision": 1,
    "fuel": 0,
    "ammo": 0,
    "assets": {}
});

units.registerSheet({
    "ID": exports.LASER_UNIT_INV,
    "cost": -1,
    "range": 0,
    "movetype": "NO_MOVE",
    "vision": 1,
    "fuel": 0,
    "ammo": 0,
    "assets": {}
});

/* ----------------------------------------------- Module API ----------------------------------------------- */

/**
 * @constant
 */
exports.TYPE_UNIT = 0;

/**
 * @constant
 */
exports.TYPE_TILE = 1;

/**
 * @constant
 */
exports.TYPE_PROPERTY = 2;

/**
 * @constant
 */
exports.TYPE_WEATHER = 3;

/**
 * @constant
 */
exports.TYPE_COMMANDER = 4;

/**
 * @constant
 */
exports.TYPE_MOVETYPE = 5;

/**
 * @constant
 */
exports.TYPE_ARMY = 6;

/**
 * @constant
 */
exports.LASER_UNIT_INV = "LASER_UNIT_INV";

/**
 * @constant
 */
exports.PROP_INV = "PROP_INV";

/**
 * @constant
 */
exports.CANNON_UNIT_INV = "CANNON_UNIT_INV";

/**
 * Returns the default weather type.
 */
exports.getDefaultWeather = function () {
    return defaultWeather;
};

/**
 *
 * @param  {Number} type type of the sheet
 * @param  {String} key id of the sheet
 * @return {Object}     sheet object
 */
exports.getSheet = function (type, key) {
    var db = getSheetDB(type);

    if (!db.sheets.hasOwnProperty(key)) {
        throw new Error("UnknownSheetIdException");
    }

    return db.sheets[key];
};

/**
 *
 * @param type
 * @returns {Array}
 */
exports.getIdList = function (type) {
    return getSheetDB(type).types;
};

/**
 *
 * @param type
 * @param id
 * @returns true when id is a valid identifier for the given type, else false
 */
exports.isValidId = function (type, id) {
    return getSheetDB(type).sheets.hasOwnProperty(id);
};

/**
 *
 * @param type
 * @param id
 * @returns {*|boolean}
 */
exports.isValidType = function (type, id) {
    return getSheetDB(type).sheets.hasOwnProperty(id);
};

/**
 *
 * @param type
 * @param sheet
 * @returns {boolean}
 */
exports.isValidSheet = function (type, sheet) {
    var db = getSheetDB(type);

    var i, e;
    for (i = 0, e = db.types.length; i < e; i++) {
        if (db.sheets[db.types[i]] === sheet) {
            return true;
        }
    }

    return false;
};