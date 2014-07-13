cwt.DataSheets = {

  LASER_UNIT_INV: "LASER_UNIT_INV",

  PROP_INV: "PROP_INV",

  CANNON_UNIT_INV: "CANNON_UNIT_INV",

  //
  // Database of commanders sheet objects.
  //
  commanders: new cwt.SheetDatabaseObject({
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
  }),

  //
  // Unit sheet holds the static data of an unit type.
  //
  //
  units: new cwt.SheetDatabaseObject({
    checks: {
      isMovetypeId: function(v, p) {
        return cwt.DataSheets.movetypes.isValidId(v) === p;
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
          not: 0
        },
        range: {
          type: "integer",
          minimum: 0,
          maximum: cwt.MAX_SELECTION_RANGE
        },
        vision: {
          type: "integer",
          minimum: 1,
          maximum: cwt.MAX_SELECTION_RANGE
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
              maximum: cwt.MAX_SELECTION_RANGE
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
  }),

  tiles: new cwt.SheetDatabaseObject({
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
  }),

  //
  //
  //
  properties: new cwt.SheetDatabaseObject({
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
  }),

  //
  // Database for army sheet objects.
  //
  armies: new cwt.SheetDatabaseObject({
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
  }),

  //
  // Movetype sheet holds the static data of an unit type.
  //
  // @class
  //
  movetypes: new cwt.SheetDatabaseObject({
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
  }),

  //
  // Weather sheet database.
  //
  weathers: new cwt.SheetDatabaseObject({
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
  }),

  //
  // Holds the default weather type.
  //
  // @type {null}
  //
  defaultWeather: null
};

// --------------------------------------------------------------------------------
//
// Registers some basic types here
//

//
// Registers a non movable move type.
//
cwt.MovetypeSheet.registerSheet({
  "ID": "NO_MOVE",
  "sound": null,
  "costs": {
    "*": -1
  }
});

//
// Invisible property type.
//
cwt.DataSheets.properties.registerSheet({
  "ID": cwt.DataSheets.PROP_INV,
  "defense": 0,
  "vision": 0,
  "capturePoints": 1,
  "blocker": true,
  "assets": {}
});

//
//
//
cwt.DataSheets.units.registerSheet({
  "ID": cwt.DataSheets.CANNON_UNIT_INV,
  "cost": 0,
  "range": 0,
  "movetype": "NO_MOVE",
  "vision": 1,
  "fuel": 0,
  "ammo": 0,
  "assets": {}
});

//
//
//
cwt.DataSheets.units.registerSheet({
  "ID": cwt.DataSheets.LASER_UNIT_INV,
  "cost": 0,
  "range": 0,
  "movetype": "NO_MOVE",
  "vision": 1,
  "fuel": 0,
  "ammo": 0,
  "assets": {}
});
