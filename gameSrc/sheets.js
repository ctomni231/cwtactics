"use strict";

var assert = require("./functions").assert;
var constants = require("./constants")

//
//
exports.SheetDatabaseObject = my.Class({

  constructor: function (impl) {
    assert(impl);

    // Holds all type sheet objects.
    //
    this.sheets = {};

    // Holds all type names.
    //
    this.types = [];

    //
    //
    this.check_ = impl.afterCheck;

    //
    //
    this.validator_ = new jjv();

    // register schema
    this.validator_.addSchema("constr", impl.schema);

    // add id check
    var that = this;
    this.validator_.addCheck('isID', function (v, p) {
      if (p) {
        return !that.sheets.hasOwnProperty(v);
      } else {
        return true;
      }
    });

    // add custom checks
    if (impl.checks) {
      for (var key in impl.checks) {
        if (impl.checks.hasOwnProperty(key)) {
          this.validator_.addCheck(key, impl.checks[key]);
        }
      }
    }
  },

  //
  // Registers a sheet in the database.
  //
  registerSheet: function (sheet) {

    // validate it
    var errors = this.validator_.validate("constr", sheet);
    if (errors) {
      assert(false,'Failed parsing sheet because of: ' + JSON.stringify(errors,null,"\t"));
    }

    // add it
    this.sheets[sheet.ID] = sheet;
    this.types.push(sheet.ID);
  },

  //
  //
  getSheet: function (id) {
    if (constants.DEBUG) assert(this.isValidId(id));

    return this.sheets[id];
  },

  isValidId: function (id) {
    return this.sheets.hasOwnProperty(id);
  },

  //
  //
  isValidSheet: function (sheet) {
    for (var i = 0, e = this.types.length; i < e; i++) {
      if (this.sheets[this.types[i]] === sheet) return true;
    }

    return false;
  }
});

exports.LASER_UNIT_INV = "LASER_UNIT_INV";

exports.PROP_INV = "PROP_INV";

exports.CANNON_UNIT_INV = "CANNON_UNIT_INV";

//
// Database of commanders sheet objects.
//
exports.commanders = new exports.SheetDatabaseObject({
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

//
// Unit sheet holds the static data of an unit type.
//
//
exports.units = new exports.SheetDatabaseObject({
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
      cost: {
        type: "integer",
        minimum: -1,
        not: { type: "integer", enum:[0] }
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

exports.tiles = new exports.SheetDatabaseObject({
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

//
//
//
exports.properties = new exports.SheetDatabaseObject({
  schema: {
    type: 'object',
    required: ['ID', "defense", "vision", "capturePoints"],
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

//
// Database for army sheet objects.
//
exports.armies = new exports.SheetDatabaseObject({
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

//
// Movetype sheet holds the static data of an unit type.
//
// @class
//
exports.movetypes = new exports.SheetDatabaseObject({
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
          '\w+': {
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

//
// Weather sheet database.
//
exports.weathers = new exports.SheetDatabaseObject({
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

//
// Holds the default weather type.
//
// @type {null}
//
exports.defaultWeather = null;

// ----
//
// Registers some basic types here
//

exports.movetypes.registerSheet({
  "ID": "NO_MOVE",
  "sound": null,
  "costs": {
    "*": -1
  }
});

exports.properties.registerSheet({
  "ID": exports.PROP_INV,
  "defense": 0,
  "vision": 0,
  "capturePoints": 1,
  "blocker": true,
  "assets": {}
});

exports.units.registerSheet({
  "ID": exports.CANNON_UNIT_INV,
  "cost": -1,
  "range": 0,
  "movetype": "NO_MOVE",
  "vision": 1,
  "fuel": 0,
  "ammo": 0,
  "assets": {}
});

exports.units.registerSheet({
  "ID": exports.LASER_UNIT_INV,
  "cost": -1,
  "range": 0,
  "movetype": "NO_MOVE",
  "vision": 1,
  "fuel": 0,
  "ammo": 0,
  "assets": {}
});