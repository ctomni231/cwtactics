"use strict";

/**
 * Database for army sheet objects.
 *
 * @type {cwt.SheetDatabase}
 */
cwt.ArmySheet = new cwt.SheetDatabase({
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

/**
 * Database of co sheet objects.
 */
cwt.CoSheet = new cwt.SheetDatabase({
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

/**
 * Movetype sheet holds the static data of an unit type.
 *
 * @class
 */
cwt.MovetypeSheet = new cwt.SheetDatabase({
  schema: {
    type: 'object',
    required: ['ID','costs'],
    properties: {
      ID: {
        type: 'string',
        isID: true
      },
      costs:{
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

/**
 * Registers a non movable move type.
 */
cwt.MovetypeSheet.registerSheet({
  "ID"    : "NO_MOVE",
  "sound" : null,
  "costs" : {
    "*" : -1
  }
});

/**
 *
 */
cwt.PropertySheet = new cwt.SheetDatabase({
  schema: {
    type: 'object',
    required: ['ID'],
    properties: {
      ID: {
        type: 'string',
        isID: true
      },
      defense: {
        type:  'integer',
        minimum: 0
      },
      vision: {
        type:  'integer',
        minimum: 0
      },
      capturePoints: {
        type:  'integer',
        minimum: 1
      },
      blocker: {
        type:  'boolean'
      }
    }
  }
});

/**
 * Invisible property type.
 */
cwt.PropertySheet.registerSheet({
  "ID"            : "PROP_INV",
  "defense"       : 0,
  "vision"        : 0,
  "capturePoints" : 1,
  "blocker"       : true,
  "assets"        : {}
});

cwt.TileSheet = new cwt.SheetDatabase({
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

/**
 * Unit sheet holds the static data of an unit type.
 *
 */
cwt.UnitSheet = new cwt.SheetDatabase({
  schema: {
    type: 'object',
    required: ['ID'],
    properties: {
      ID: {
        type: 'string',
        isID: true
      }
    }
  },

  $afterLoad: function () {
    var schema = {};
    (cwt.createModuleCaller("$defineUnitSchema"))(schema);
    cwt.UnitSheet.schema = schema;
  },

  afterConstruct: function ( sheet ) {
    sheet.blocked = false;
  },

  /**
   * Accepts key,value pairs where the key is a unit sheet id or movetype id or *.
   * The value has to be a positive integer greater than 0.
   *
   * @param key
   * @param value
   * @private
   */
  attackTargetCheck_: function (key, value) {
    if (key === "*") return;
    cwt.assert(cwt.UnitSheet.sheets.hasOwnProperty(key));
    cwt.assert(value > 0);
  },

  /**
   * Accepts key objects that are unit sheet ids or *.
   *
   * @param key
   * @private
   */
  typeTargetCheck_: function (key) {
    if (key === "*") return;
    cwt.assert(cwt.UnitSheet.sheets.hasOwnProperty(key));
  },

  /**
   * Accepts key objects that are unit sheet ids or movetype ids or *.
   *
   * @param key
   * @private
   */
  typeOrMovetypeTargetCheck_: function (key) {
    if (key === "*") return;
    cwt.assert(cwt.UnitSheet.sheets.hasOwnProperty(key) ||
      cwt.MovetypeSheet.sheets.hasOwnProperty(key));
  },

  check: function ( sheet ) {

    // check_ base aw2
    cwt.assert(sheet.cost >= -1);
    cwt.assert(sheet.range >= 0 && sheet.range <= MAX_SELECTION_RANGE);
    cwt.assert(cwt.MovetypeSheet.sheets.hasOwnProperty(sheet.movetype));
    cwt.assert(sheet.vision >= 1 && sheet.vision <= MAX_SELECTION_RANGE);
    cwt.assert(sheet.fuel >= 0 && sheet.fuel < 100);

    // check_ capturing
    cwt.assert(sheet.captures === undefined || sheet.captures >= 1);

    // check_ drain fuel
    cwt.assert(sheet.dailyFuelDrain === undefined || (
      sheet.dailyFuelDrain >= 1 && sheet.dailyFuelDrain < 100));
    cwt.assert(sheet.dailyFuelDrainHidden === undefined || (
      sheet.dailyFuelDrainHidden >= 2 && sheet.dailyFuelDrainHidden < 100 ));

    // check_ stealth
    cwt.assert(sheet.stealth === void 0 || sheet.stealth === true || sheet.stealth === false);

    // check_ suicide
    if (sheet.suicide) {
      cwt.assert(sheet.suicide.damage >= 1 && sheet.suicide.damage <= 10);
      cwt.assert(sheet.suicide.range >= 1 && sheet.suicide.range <= MAX_SELECTION_RANGE);
      if (sheet.suicide.nodamage) {
        cwt.doListCheck(sheet.suicide.nodamage, sheet.typeTargetCheck_);
      }
    }

    // check_ transport
    if (sheet.maxloads !== undefined || sheet.canload !== undefined) {
      cwt.assert(sheet.maxloads >= 1);
      cwt.doListCheck(sheet.canload, sheet.typeOrMovetypeTargetCheck_);
    }

    // check_ supply
    if (sheet.supply !== undefined) {
      cwt.doListCheck(sheet.supply, sheet.typeOrMovetypeTargetCheck_);
    }

    // check_ attack
    cwt.assert(sheet.ammo === void 0 || (sheet.ammo >= 0 && sheet.ammo < 100));
    if (sheet.attack) {
      cwt.assert(sheet.attack.minrange === undefined || sheet.attack.minrange >= 1);
      cwt.assert(sheet.attack.maxrange === undefined || (
        sheet.attack.maxrange >= 2 && sheet.attack.maxrange > sheet.attack.minrange ));

      cwt.assert(sheet.attack.main_wp || sheet.attack.sec_wp);
      if (sheet.attack.main_wp) cwt.doObjectCheck(sheet.attack.main_wp, sheet.attackTargetCheck_);
      if (sheet.attack.sec_wp) cwt.doObjectCheck(sheet.attack.sec_wp, sheet.attackTargetCheck_);
    }
  }
});
cwt.UnitSheet.registerSheet({
  "ID"       : "CANNON_UNIT_INV",
  "cost"     : 0,
  "range"    : 0,
  "movetype" : "NO_MOVE",
  "vision"   : 1,
  "fuel"     : 0,
  "ammo"     : 0,
  "assets"   : {}
});
cwt.UnitSheet.registerSheet({
  "ID"       : "LASER_UNIT_INV",
  "cost"     : 0,
  "range"    : 0,
  "movetype" : "NO_MOVE",
  "vision"   : 1,
  "fuel"     : 0,
  "ammo"     : 0,
  "assets"   : {}
});

/**
 * Weather sheet database.
 */
cwt.WeatherSheet = new cwt.SheetDatabase({
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
  },

  afterCheck: function (sheet) {
    if (sheet.defaultWeather) {
      cwt.WeatherSheet.defaultWeather = sheet;
    }
  }

});

/**
 * Holds the default weather type.
 *
 * @type {null}
 */
cwt.WeatherSheet.defaultWeather = null;