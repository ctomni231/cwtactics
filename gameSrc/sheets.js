"use strict";

var debug = require("./debug");
var constants = require("./constants");
var JsonSchema = require("../libJs/jjv");

var commanders = new SheetDatabaseObject({
    schema: {
        type: 'object',
        required: ['ID'],
        properties: {
            ID: {
                type: 'string',
                isID: true
            }
        }
    }
});

var units = new SheetDatabaseObject({

    checks: {
        isMovetypeId: function (v, p) {
            return exports.movetypes.isValidId(v) === p;
        }
    },

    schema: {
        type: 'object',
        required: ['ID', "cost", "range", "vision", "fuel", "movetype"],
        properties: {
            ID: {
                type: 'string',
                isID: true
            },
            suicide: {
                type: 'object',
                required: ["damage", "range"],
                properties: {
                    damage: {
                        type: "integer",
                        minimum: 1,
                        maximum: 10
                    },
                    range: {
                        type: "integer",
                        minimum: 1,
                        maximum: constants.MAX_SELECTION_RANGE
                    },
                    nodamage: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                }
            },
            attack: {
                type: "object",
                properties: {
                    main_wp: {
                        type: "object",
                        patternProperties: {
                            "[a-zA-Z]*": {
                                type: "integer",
                                minimum: 1
                            }
                        }
                    },
                    sec_wp: {
                        type: "object",
                        patternProperties: {
                            "[a-zA-Z]*": {
                                type: "integer",
                                minimum: 1
                            }
                        }
                    }
                }
            }
        }
    }
});

var tiles = new SheetDatabaseObject({
    schema: {
        type: 'object',
        required: ['ID', "defense"],
        properties: {
            ID: {
                type: 'string',
                isID: true
            },
            defense: {
                type: "number",
                minimum: 0
            }
        }
    }
});

var properties = new SheetDatabaseObject({
    schema: {
        type: 'object',
        required: ['ID', "defense", "vision"],
        properties: {
            ID: {
                type: 'string',
                isID: true
            },
            defense: {
                type: 'integer',
                minimum: 0
            },
            vision: {
                type: 'integer',
                minimum: 0
            },
            capturePoints: {
                type: 'integer',
                minimum: 1
            },
            blocker: {
                type: 'boolean'
            }
        }
    }
});

var armies = new SheetDatabaseObject({
    schema: {
        type: 'object',
        required: ['ID'],
        properties: {
            ID: {
                type: 'string',
                isID: true
            }
        }
    }
});

var movetypes = new SheetDatabaseObject({
    schema: {
        type: 'object',
        required: ['ID', 'costs'],
        properties: {
            ID: {
                type: 'string',
                isID: true
            },
            costs: {
                type: 'object',
                patternProperties: {
                    "\w+": {
                        type: 'integer',
                        minimum: -1,
                        maximum: 100,
                        not: 0
                    }
                }
            }
        }
    }
});

var weathers = new SheetDatabaseObject({
    schema: {
        type: 'object',
        required: ['ID'],
        properties: {
            ID: {
                type: 'string',
                isID: true
            },
            defaultWeather: {
                type: 'boolean'
            }
        }
    }
});

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

/** */
exports.TYPE_UNIT = 0;

/** */
exports.TYPE_TILE = 1;

/** */
exports.TYPE_PROPERTY = 2;

/** */
exports.TYPE_WEATHER = 3;

/** */
exports.TYPE_COMMANDER = 4;

/** */
exports.TYPE_MOVETYPE = 5;

/** */
exports.TYPE_ARMY = 6;

/** */
exports.LASER_UNIT_INV = "LASER_UNIT_INV";

/** */
exports.PROP_INV = "PROP_INV";

/** */
exports.CANNON_UNIT_INV = "CANNON_UNIT_INV";

/** Returns the default weather type. */
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

exports.registerSheet = function (type, sheet) {
    getSheetDB(type).registerSheet(sheet);
}

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
        if (db.sheets[db.types[i]] === sheet) return true;
    }

    return false;
};