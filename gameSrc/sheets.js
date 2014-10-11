"use strict";

var constants = require("./constants");
var JsonSchema = window.jjv;

/**
 * A data object that holds a list of sheet objects with a given schema. Every sheet that will be
 * added to the data object will be validated first.
 *
 * @class
 */
var SheetDatabaseObject = function(impl) {
  if (!impl) {
    throw new Error("SheetDatabaseException: no schema given");
  }

  /**
   * Holds all type sheet objects.
   */
  this.sheets = {};

  /**
   * Holds all type names.
   */
  this.types = [];

  /**
   *
   */
  this.validator = new JsonSchema();

  // register schema
  this.validator.addSchema("constr", impl.schema);

  // add id check
  var that = this;
  this.validator.addCheck('isID', function(v, p) {
    return p ? !that.sheets.hasOwnProperty(v) : true;
  });

  // add custom checks
  if (impl.checks) {
    var key;
    for (key in impl.checks) {
      if (impl.checks.hasOwnProperty(key)) {
        this.validator.addCheck(key, impl.checks[key]);
      }
    }
  }
};

SheetDatabaseObject.prototype.registerSheet = function(sheet) {

  // validate it
  var errors = this.validator.validate("constr", sheet);
  if (errors) {
    throw new Error("Failed parsing sheet because of: " + JSON.stringify(errors, null, "\t"));
  }

  // add it
  this.sheets[sheet.ID] = sheet;
  this.types.push(sheet.ID);
};

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

// TODO: private
//
// Unit sheet holds the static data of an unit type.
//
//
var units = new SheetDatabaseObject({
  checks: {
    isMovetypeId: function(v, p) {
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
      cost: {
        type: "integer",
        minimum: -1,
        not: {
          type: "integer",
          "enum": [0]
        }
      },
      range: {
        type: "integer",
        minimum: 0,
        maximum: constants.MAX_SELECTION_RANGE
      },
      vision: {
        type: "integer",
        minimum: 1,
        maximum: constants.MAX_SELECTION_RANGE
      },
      fuel: {
        type: "integer",
        minimum: 0,
        maximum: 99
      },
      ammo: {
        type: "integer",
        minimum: 0,
        maximum: 99
      },
      dailyFuelDrain: {
        type: "integer",
        minimum: 1,
        maximum: 99
      },
      dailyFuelDrainHidden: {
        type: "integer",
        minimum: 2,
        maximum: 99
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
      movetype: {
        type: "string",
        isMovetypeId: true
      },
      maxloads: {
        type: "integer",
        minimum: 1
      },
      canload: {
        type: "array",
        items: {
          type: "string"
        }
      },
      captures: {
        type: "integer",
        minimum: 1
      },
      stealth: {
        type: "boolean"
      },
      supply: {
        type: "array",
        items: {
          type: "string"
        }
      },
      attack: {
        type: "object",
        properties: {
          minrange: {
            type: "integer",
            minimum: 1
          },
          maxrange: {
            type: "integer",
            minimum: 2
          },
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

var tiles = new exports.SheetDatabaseObject({
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

var properties = new exports.SheetDatabaseObject({
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

var armies = new exports.SheetDatabaseObject({
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

var movetypes = new exports.SheetDatabaseObject({
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

var weathers = new exports.SheetDatabaseObject({
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
 * Returns the default weather type.
 */
exports.getDefaultWeather = function() {
  return defaultWeather;
};

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

var getSheetDB = function(type) {
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

/**
 * @param  {Number} type type of the sheet
 * @param  {String} key id of the sheet
 * @return {Object}     sheet object
 */
exports.getSheet = function(type, key) {
  var db = getSheetDB(type);

  if (!db.sheets.hasOwnProperty(key)) {
    throw new Error("UnknownSheetIdException");
  }

  return db.sheets[key];
};

exports.isValidId = function(type, id) {
  return getSheetDB(type).sheets.hasOwnProperty(id);
};

exports.isValidType = function(type, id) {
  return getSheetDB(type).sheets.hasOwnProperty(id);
};

exports.isValidSheet = function(type, sheet) {
  var db = getSheetDB(type);

  var i, e;
  for (i = 0, e = db.types.length; i < e; i++) {
    if (db.sheets[db.types[i]] === sheet) {
      return true;
    }
  }

  return false;
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