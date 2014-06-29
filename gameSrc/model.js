"use strict";

// **Class Player**
//
cwt.Player = my.Class({

  STATIC: {

    // **Player.MULTITON_INSTANCES (Const)**
    //
    // Controls the maximum number of players.
    //
    MULTITON_INSTANCES: 4,

    /**
     * Number of maximum units per player.
     *
     * @constant
     */
    MAX_UNITS: 50,

    // **onInstanceCreation (event)**
    //
    onInstanceCreation: function (id, player) {
      player.id = id;
    },

    /**
     * @type {cwt.Player}
     */
    activeClientPlayer: null
  },

  constructor: function () {

    // **Player.id (int)**
    //
    this.id = -1;

    // **Player.team (int)**
    //
    this.team = cwt.INACTIVE;

    // **Player.gold (int)**
    //
    this.gold = 0;

    // **Player.power (int)**
    //
    this.power = 0;

    // **Player.activePower (int)**
    //
    this.activePower = cwt.INACTIVE;

    // **Player.powerUsed (int)**
    //
    this.powerUsed = 0;

    // **Player.manpower (int)**
    //
    this.manpower = Math.POSITIVE_INFINITY;

    // **Player.coA (?)**
    //
    this.coA = null;

    // use a variable for performance reasons
    // **Player.numberOfUnits (boolean)**
    //
    this.numberOfUnits = 0;

    // **Player.turnOwnerVisible (boolean)**
    //
    this.turnOwnerVisible = false;

    // **Player.clientVisible (boolean)**
    //
    this.clientVisible = false;

    // **Player.clientControlled (boolean)**
    //
    this.clientControlled = false;
  },

  // **Player.isPowerActive(num): boolean**
  //
  isPowerActive: function (level) {
    return this.activePower === level;
  }
});
my.extendClass(cwt.Player,{STATIC:cwt.IndexMultiton});

// **Class Position**
//
// Object that holds information about objects at a given position (x,y).
//
cwt.Position = my.Class({

  constructor: function () {
    this.clean();
  },

  /**
   * Cleans all data of the object.
   */
  clean: function () {
    this.x = -1;
    this.y = -1;
    this.tile = null;
    this.unit = null;
    this.property = null;
    this.unitId = -1;
    this.propertyId = -1;
  },

  /**
   * Grabs the data from another position object.
   */
  grab: function (otherPos) {
    cwt.assert(otherPos instanceof cwt.Position);

    this.x = otherPos.x;
    this.y = otherPos.y;
    this.tile = otherPos.tile;
    this.unit = otherPos.unit;
    this.unitId = otherPos.unitId;
    this.property = otherPos.property;
    this.propertyId = otherPos.propertyId;
  },

  /**
   * Sets a position.
   */
  set: function (x, y) {
    this.clean();

    this.x = x;
    this.y = y;
    this.tile = cwt.Map.data[x][y];

    if (this.tile.visionTurnOwner > 0 && this.tile.unit) {
      this.unit = this.tile.unit;
      this.unitId = cwt.Unit.getInstanceId(this.tile.unit);
    }

    if (this.tile.property) {
      this.property = this.tile.property;
      this.propertyId = cwt.Property.getInstanceId(this.tile.property);
    }
  }
});

cwt.Property = my.Class({

  STATIC: /** @lends cwt.Property */ {

    /**
     * Number of maximum properties.
     */
    MULTITON_INSTANCES: 200,

    CAPTURE_POINTS: 20,

    CAPTURE_STEP: 10,

    /**
     *
     * @param {cwt.Player} player
     * @return {number}
     */
    countProperties: function (player) {
      var n = 0;

      for (var i = 0, e = this.MULTITON_INSTANCES; i < e; i++) {
        var prop = cwt.Property.getInstance(i, true);
        if (prop && prop.owner === player) n++;
      }

      return n;
    },

    releasePlayerProperties: function (player) {
      for (var i = 0, e = this.MULTITON_INSTANCES; i < e; i++) {
        var prop = cwt.Property.getInstance(i, true);
        if (prop && prop.owner === player) {
          // TODO

          // change type when the property is a
          // changing type property
          // var changeType = prop.type.changeAfterCaptured;
          // if (changeType) model.events.property_changeType(i, changeType);
        }
      }
    }

  },

  constructor: function () {
    this.points = 20;

    /**
     * @type {cwt.Player}
     */
    this.owner = null;

    this.type = null;
  },

  /**
   * Returns true, when the given property is neutral, else false.
   */
  isNeutral: function () {
    return this.owner === null;
  }

});
my.extendClass(cwt.Property,{STATIC:cwt.IndexMultiton});

cwt.Tile = my.Class({

  constructor: function () {

    this.type = null;

    /**
     * @type {cwt.Unit}
     */
    this.unit = null;

    /**
     * @type {cwt.Property}
     */
    this.property = null;

    /**
     * @type {number}
     */
    this.visionTurnOwner = 0;

    /**
     * @type {number}
     */
    this.variant = 0;

    /**
     * @type {number}
     */
    this.visionClient = 0;
  },

  /**
   *
   * @return {boolean}
   */
  isOccupied: function () {
    return this.unit !== null;
  },

  /**
   *
   * @return {boolean}
   */
  isVisible: function () {
    return this.visionTurnOwner > 0;
  }

});

cwt.Unit = my.Class({

  STATIC: /** @lends cwt.Unit */ {

    /**
     * Maximum number of unit objects for the whole game.
     */
    MULTITON_INSTANCES: cwt.Player.MAX_UNITS * cwt.Player.MULTITON_INSTANCES,

    /**
     * Converts HP points to a health value.
     *
     * @return {number}
     *
     * @example
     *    6 HP -> 60 health
     *    3 HP -> 30 health
     */
    pointsToHealth: function (pt) {
      return (pt * 10);
    },

    /**
     * Converts and returns the HP points from the health
     * value of an unit.
     *
     * @example
     *   health ->  HP
     *     69   ->   7
     *     05   ->   1
     *     50   ->   6
     *     99   ->  10
     */
    healthToPoints: function (health) {
      return parseInt(health / 10, 10) + 1;
    },

    /**
     * Gets the rest of unit health.
     */
    healthToPointsRest: function (health) {
      return health - (parseInt(health / 10) + 1);
    },

    /**
     * Counts the number of units of a player.
     *
     * @param player
     * @return {number}
     */
    countUnitsOfPlayer: function (player) {
      var n = 0;
      for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
        var unit = cwt.Unit.getInstance(i, false);
        if (unit && unit.owner === player) {
          n++;
        }
      }

      return n;
    },

    destroyPlayerUnits: function (player) {
      if (cwt.DEBUG) cwt.assert(player instanceof cwt.Player);
      for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
        var unit = cwt.Unit.getInstance(i, false);
        if (unit && unit.owner === player) {
          // TODO
        }
      }
    }
  },

  constructor: function () {
    this.hp = 99;
    this.ammo = 0;
    this.fuel = 0;

    /**
     *
     * // type {number} 0=visible, 1=hidden but visible by enemy or 2=complete hidden
     * @type {boolean}
     */
    this.hidden = false;

    this.loadedIn = cwt.INACTIVE;

    this.type = null;
    this.canAct = false;

    /**
     * If the value is null then unit does not exists on the map.
     *
     * @type {cwt.Player}
     */
    this.owner = null;
  },

  initByType: function (type) {

  },

  /**
   * Damages a unit.
   */
  takeDamage: function (damage, minRest) {
    this.hp -= damage;

    if (minRest && this.hp <= minRest) {
      this.hp = minRest;
    }
  },

  /**
   * Heals an unit. If the unit health will be greater than the maximum
   * health value then the difference will be added as gold to the
   * owners gold depot.
   */
  heal: function (health, diffAsGold) {
    this.hp += health;
    if (this.hp > 99) {

      // pay difference of the result health and 100 as
      // gold ( in relation to the unit cost ) to the
      // unit owners gold depot
      if (diffAsGold === true) {
        var diff = this.hp - 99;
        this.owner.gold += parseInt((this.type.cost * diff) / 100, 10);
      }

      this.hp = 99;
    }
  },

  /**
   * @return {boolean} true when hp is greater than 0 else false
   */
  isAlive: function () {
    return this.hp > 0;
  },

  /**
   * Returns true when the unit ammo is lower equals 25%.
   *
   * @return {boolean}
   */
  hasLowAmmo: function () {
    var cAmmo = this.ammo;
    var mAmmo = this.type.ammo;
    if( mAmmo != 0 && cAmmo <= parseInt(mAmmo*0.25, 10) ) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * Returns true when the unit fuel is lower equals 25%.
   *
   * @return {boolean}
   */
  hasLowFuel: function () {
    var cFuel = this.fuel;
    var mFuel = this.type.fuel;
    if( cFuel <= parseInt(mFuel*0.25, 10) ) {
      return true;
    } else {
      return false;
    }
  },

  isCapturing: function () {
    if (this.loadedIn != cwt.INACTIVE) {
      return false;
    }

    return false;
    /*
    if( unit.x >= 0 ){
      var property = model.property_posMap[ unit.x ][ unit.y ];
      if( property !== null && property.capturePoints < 20 ){
        unitStatus.CAPTURES = true;
      }
      else unitStatus.CAPTURES = false;
    } */
  }

  /*
   function inVision( x,y, tid, unitStatus ){
   if( !model.map_isValidPosition(x,y) ) return;

   var unit = model.unit_posData[x][y];
   if( unit ){
   if( model.player_data[unit.owner].team !== tid ) unitStatus.VISIBLE = true;

   // IF UNIT IS HIDDEN THEN YOU CAN SEE IT NOW
   if( unit.hidden ) controller.unitStatusMap[ model.unit_extractId(unit) ].VISIBLE = true;
   }
   };

   function checkHiddenStatus( unit, unitStatus ){
   if( !unitStatus ){
   unitStatus = controller.unitStatusMap[ model.unit_extractId(unit) ];
   }

   unitStatus.VISIBLE = true;
   if( unit.hidden ){
   unitStatus.VISIBLE = false;

   // CHECK NEIGHBOURS AND HIDDEN ON NEIGHBOURS
   var x = unit.x;
   var y = unit.y;
   var ttid = model.player_data[unit.owner].team;
   inVision( x-1,y, ttid, unitStatus );
   inVision( x,y-1, ttid, unitStatus );
   inVision( x,y+1, ttid, unitStatus );
   inVision( x+1,y, ttid, unitStatus );
   }
   };function inVision( x,y, tid, unitStatus ){
   if( !model.map_isValidPosition(x,y) ) return;

   var unit = model.unit_posData[x][y];
   if( unit ){
   if( model.player_data[unit.owner].team !== tid ) unitStatus.VISIBLE = true;

   // IF UNIT IS HIDDEN THEN YOU CAN SEE IT NOW
   if( unit.hidden ) controller.unitStatusMap[ model.unit_extractId(unit) ].VISIBLE = true;
   }
   };

   function checkHiddenStatus( unit, unitStatus ){
   if( !unitStatus ){
   unitStatus = controller.unitStatusMap[ model.unit_extractId(unit) ];
   }

   unitStatus.VISIBLE = true;
   if( unit.hidden ){
   unitStatus.VISIBLE = false;

   // CHECK NEIGHBOURS AND HIDDEN ON NEIGHBOURS
   var x = unit.x;
   var y = unit.y;
   var ttid = model.player_data[unit.owner].team;
   inVision( x-1,y, ttid, unitStatus );
   inVision( x,y-1, ttid, unitStatus );
   inVision( x,y+1, ttid, unitStatus );
   inVision( x+1,y, ttid, unitStatus );
   }
   };

   model.event_on("damageUnit",function( uid ){
   controller.updateUnitStatus( uid );
   });

   model.event_on("healUnit",function( uid ){
   controller.updateUnitStatus( uid );
   });

   model.event_on("battle_mainAttack",function( auid,duid,dmg,mainWeap ){
   var type = model.unit_data[auid].type;
   var sound = (mainWeap)? type.assets.pri_att_sound : type.assets.sec_att_sound;
   if( sound ) controller.audio_playSound( sound );
   });

   model.event_on("battle_counterAttack",function( auid,duid,dmg,mainWeap ){
   var type = model.unit_data[auid].type;
   var sound = (mainWeap)? type.assets.pri_att_sound : type.assets.sec_att_sound;
   if( sound ) controller.audio_playSound( sound );
   });

  model.event_on("attack_invoked",function( auid,duid ){
    controller.updateSimpleTileInformation();
    controller.updateUnitStatus( auid );
    controller.updateUnitStatus( duid );
  });

model.event_on("buildUnit_invoked",function(){
  controller.updateSimpleTileInformation();
});


model.event_on("createUnit",function( id ){
  controller.updateUnitStatus( id );
});

model.event_on("loadUnit_invoked",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

model.event_on("unloadUnit_invoked",function( transportId, trsx, trsy, loadId, tx,ty ){
  controller.updateUnitStatus( transportId );
});

model.event_on("joinUnits_invoked",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

model.event_on("supply_refillResources",function( uid ){
  if( typeof uid.x === "number" ) uid = model.unit_extractId(uid);
  controller.updateUnitStatus( uid );
});

model.event_on("clearUnitPosition",function( uid ){
  var unit = model.unit_data[uid];
  var x = -unit.x;
  var y = -unit.y;

  // CHECK HIDDEN, BUT VISIBLE NEIGHBOURS
  if( model.map_isValidPosition(x-1,y) && model.unit_posData[x-1][y] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x-1][y]) );
  }
  if( model.map_isValidPosition(x+1,y) && model.unit_posData[x+1][y] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x+1][y]) );
  }
  if( model.map_isValidPosition(x,y+1) && model.unit_posData[x][y+1] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x][y+1]) );
  }
  if( model.map_isValidPosition(x,y-1) && model.unit_posData[x][y-1] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x][y-1]) );
  }
});

model.event_on("setUnitPosition",function( uid ){
  controller.updateUnitStatus( uid );
});

model.event_on("unitHide_invoked",function( uid ){
  controller.updateUnitStatus( uid );
});

model.event_on("unitUnhide_invoked",function( uid ){
  controller.updateUnitStatus( uid );
});


*/
});
my.extendClass(cwt.Unit,{STATIC:cwt.IndexMultiton});

cwt.Gameround = {

  /**
   * Advance Wars 1 game mode. The first ever released game mode
   * of the advance wars series (GBA and up).
   */
  GAME_MODE_AW1: 0,

  /**
   * Advance Wars 2 game mode. It introduced the Super CO Power.
   */
  GAME_MODE_AW2: 1,

  /**
   * The current active co mode.
   */
  gameMode: 0,

  /**
   * The current active day.
   */
  day: 0,

  /**
   * The current active turn owner. Only the turn owner
   * can do actions.
   *
   * @type {cwt.Player}
   */
  turnOwner: null,

  /**
   * Maximum turn time limit in ms.
   *
   * @type {Number}
   */
  turnTimeLimit: 0,

  /**
   * Current elapsed turn time in ms.
   *
   * @type {Number}
   */
  turnTimeElapsed: 0,

  /**
   * Maximum game time limit in ms.
   *
   * @type {Number}
   */
  gameTimeLimit: 0,

  /**
   * Current elapsed game time in ms.
   *
   * @type {Number}
   */
  gameTimeElapsed: 0,

  /**
   * Returns `true` when at least two opposite teams are left, else `false`.
   */
  areEnemyTeamsLeft: function () {
    var player;
    var foundTeam = -1;
    var i = 0;
    var e = cwt.Player.MULTITON_INSTANCES;

    for (; i < e; i++) {
      player = cwt.Player.getInstance(i);

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
  },

  /**
   * Returns true if the given player id is the current turn owner.
   */
  isTurnOwner: function (player) {
    return this.turnOwner === player;
  },

  /**
   * Converts a number of days into turns.
   */
  convertDaysToTurns: function (days) {
    return cwt.Player.MULTITON_INSTANCES * days;
  },

  /**
   * The active weather type object.
   */
  weather: null,

  /**
   * The amount of days until the weather will be
   * changed.
   */
  weatherLeftDays: 0,

  /**
   * Returns `true` when the game is in the peace phase.
   */
  inPeacePhase: function () {
    return (this.day < cwt.Config.getValue("daysOfPeace"));
  },

  /**
   *
   * @param {cwt.Unit|cwt.Property|null} obj
   * @return {boolean}
   */
  isTurnOwnerObject: function (obj) {
    return (obj != null && obj.owner === this.turnOwner);
  },

  $onSaveGame: function (data) {
    data.wth = this.weather.ID;
    data.trOw = this.turnOwner.id;
    data.day = this.day;
    data.gmTm = this.gameTimeElapsed;
    data.tnTm = this.turnTimeElapsed;
  },

  $onLoadGame: function (data, isSave) {
    this.weather = cwt.WeatherSheet.defaultWeather;
    this.day = 0;

    if (isSave) {
      cwt.assert(cwt.WeatherSheet.sheets.hasOwnProperty(data.wth));
      cwt.assert(data.trOw >= 0 && data.trOw < 9999999);
      cwt.assert(data.day >= 0 && data.day < 9999999);
      cwt.assert(data.gmTm >= 0);
      cwt.assert(data.tnTm >= 0);

      this.weather = cwt.WeatherSheet.sheets[data.wth];
      this.turnOwner = /** @type {cwt.Player} */ cwt.Player.getInstance(data.trOw);
      this.day = data.day;this.gameTimeElapsed = data.gmTm;
      this.turnTimeElapsed = data.tnTm;
    }
  }
};

/**
 * @namespace
 */
cwt.Map = {

  /**
   * Current width of the map.
   *
   * @type {Number}
   */
  width: 0,

  /**
   * Current height of the map.
   *
   * @type {Number}
   */
  height: 0,

  /**
   * All tiles of the map.
   *
   * @type {Array.<Array.<cwt.Tile>>}
   */
  data: (function () {
    var matrix = new cwt.Matrix(cwt.MAX_MAP_WIDTH, cwt.MAX_MAP_HEIGHT);
    for (var x = 0, xe = cwt.MAX_MAP_WIDTH; x < xe; x++) {
      for (var y = 0, ye = cwt.MAX_MAP_HEIGHT; y < ye; y++) {
        matrix.data[x][y] = new cwt.Tile();
      }
    }

    return matrix.data;
  })(),

  /**
   * Returns the distance of two positions.
   */
  getDistance: function (sx, sy, tx, ty) {
    if (this.DEBUG) cwt.assert(this.isValidPosition(sx, sy));
    if (this.DEBUG) cwt.assert(this.isValidPosition(tx, ty));

    return Math.abs(sx - tx) + Math.abs(sy - ty);
  },

  /**
   * Returns true if the given position (x,y) is valid on the current
   * active map, else false.
   */
  isValidPosition: function (x, y) {
    return ( x >= 0 && y >= 0 && x < this.width && y < this.height );
  },

  /**
   *
   * @param property
   * @param cb
   * @param cbThis
   * @param arg
   */
  searchProperty: function (property, cb, cbThis, arg) {
    for (var x = 0, xe = this.width; x < xe; x++) {
      for (var y = 0, ye = this.height; y < ye; y++) {
        if (this.data[x][y].property === property) {
          cb.call(cbThis, x, y, property, arg);
        }
      }
    }
  },

  /**
   *
   * @param unit
   * @param cb
   * @param cbThis
   * @param {Object=} arg
   */
  searchUnit: function (unit, cb, cbThis, arg) {
    for (var x = 0, xe = this.width; x < xe; x++) {
      for (var y = 0, ye = this.height; y < ye; y++) {
        if (this.data[x][y].unit === unit) {
          return cb.call(cbThis, x, y, unit, arg);
        }
      }
    }
  },

  /**
   * Invokes a callback on all tiles in a given range at a position (x,y).
   */
  doInRange: function (x, y, range, cb, arg) {
    if (this.DEBUG) cwt.assert(this.isValidPosition(x, y));
    if (this.DEBUG) cwt.assert(typeof cb === "function");
    if (this.DEBUG) cwt.assert(range >= 0);

    var lX;
    var hX;
    var lY = y - range;
    var hY = y + range;
    if (lY < 0) lY = 0;
    if (hY >= this.height) hY = this.height - 1;
    for (; lY <= hY; lY++) {

      var disY = Math.abs(lY - y);
      lX = x - range + disY;
      hX = x + range - disY;
      if (lX < 0) lX = 0;
      if (hX >= this.width) hX = this.width - 1;
      for (; lX <= hX; lX++) {

        // invoke the callback on all tiles in range
        // if a callback returns `false` then the process will be stopped
        if (cb(lX, lY, this.data[lX][lY], arg, Math.abs(lX - x) + disY) === false) return;

      }
    }
  },

  $onSaveGame: function (data) {
    var that = cwt.Map;
    data.mpw = this.width;
    data.mph = this.height;
    data.map = [];
    data.prps = [];
    data.units = [];

    // generates ID map
    var mostIdsMap = {};
    var mostIdsMapCurIndex = 0;
    for (var x = 0, xe = that.width; x < xe; x++) {

      data.map[x] = [];
      for (var y = 0, ye = that.height; y < ye; y++) {
        var type = that.data[x][y].type.ID;

        // create number for type
        if (!mostIdsMap.hasOwnProperty(type)) {
          mostIdsMap[type] = mostIdsMapCurIndex;
          mostIdsMapCurIndex++;
        }

        data.map[x][y] = mostIdsMap[type];

        // save property
        var prop = that.data[x][y].property;
        if (prop) {
          data.prps.push([
            cwt.Property.getInstanceId(prop),
            x,
            y,
            prop.type.ID,
            prop.capturePoints,
            prop.owner.id
          ]);
        }

        // save unit
        var unit = that.data[x][y].unit;
        if (unit) {
          data.units.push([
            cwt.Unit.getInstanceId(unit),
            unit.type.ID,
            x,
            y,
            unit.hp,
            unit.ammo,
            unit.fuel,
            unit.loadedIn,
            unit.owner.id,
            unit.canAct,
            unit.hidden
          ]);
        }
      }
    }

    // generate type map
    data.typeMap = [];
    var typeKeys = Object.keys(mostIdsMap);
    for (var i = 0, e = typeKeys.length; i < e; i++) {
      data.typeMap[mostIdsMap[typeKeys[i]]] = typeKeys[i];
    }
  },

  $onLoadGame: function (data, isSave) {
    var that = cwt.Map;
    
    var property;
    var unit;
    var player;

    that.width = data.mpw;
    that.height = data.mph;

    // map
    for (var x = 0, xe = that.width; x < xe; x++) {
      for (var y = 0, ye = that.height; y < ye; y++) {
        that.data[x][y].type = cwt.TileSheet.sheets[data.typeMap[data.map[x][y]]];
      }
    }

    // prepare properties
    for (var i = 0, e = cwt.Property.MULTITON_INSTANCES; i < e; i++) {
      property = cwt.Property.getInstance(i, true);
      if (property) {
        property.owner = null;
        property.type = null;
        property.capturePoints = 20;
      }
    }

    // saved properties
    cwt.assert(Array.isArray(data.prps));
    for (var i = 0, e = data.prps.length; i < e; i++) {
      var propData = data.prps[i];

      // check_ map data
      cwt.assert(propData[0] >= 0 && propData[0] < cwt.Property.MULTITON_INSTANCES);
      cwt.assert(propData[1] >= 0 && propData[1] < that.width);
      cwt.assert(propData[2] >= 0 && propData[2] < that.height);
      cwt.assert(cwt.PropertySheet.sheets.hasOwnProperty(propData[3]));
      cwt.assert(propData[5] >= -1 && propData[5] < cwt.Player.MULTITON_INSTANCES);

      //cwt.assert(
      //  (util.isString(propData[3]) && !util.isUndefined(model.data_tileSheets[propData[3]].capturePoints)) ||
      //    typeof model.data_tileSheets[propData[3]].cannon !== "undefined" ||
      //    typeof model.data_tileSheets[propData[3]].laser !== "undefined" ||
      //    typeof model.data_tileSheets[propData[3]].rocketsilo !== "undefined"
      //);

      //cwt.assert((util.intRange(propData[4], 1, // capture points
      //  model.data_tileSheets[propData[3]].capturePoints)) ||
      // (util.intRange(propData[4], -99, -1)) ||
      //  typeof model.data_tileSheets[propData[3]].rocketsilo !== "undefined"
      //);

      // copy data into model
      property = cwt.Property.getInstance(propData[0]);
      property.type = cwt.PropertySheet.sheets[propData[3]];
      property.capturePoints = propData[4];
      property.owner = (propData[5] != cwt.INACTIVE)? cwt.Player.getInstance(propData[5]) : null;
      that.data[propData[1]][propData[2]].property = property;
    }

    // prepare units
    cwt.assert(Array.isArray(data.units));
    for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
      unit = cwt.Unit.getInstance(i, true);
      if (unit) {
        unit.owner = null;
      }
    }

    // saved units
    for (var i = 0, e = data.units.length; i < e; i++) {
      var unitData = data.units[i];

      // check_ map data
      cwt.assert(unitData[0] >= 0 && unitData[0] < cwt.Unit.MULTITON_INSTANCES);
      cwt.assert(cwt.UnitSheet.sheets.hasOwnProperty(unitData[1]));
      cwt.assert(that.isValidPosition(unitData[2], unitData[3]));
      cwt.assert(unitData[4] >= 1 && unitData[4] <= 99);

      var type = cwt.UnitSheet.sheets[unitData[1]];
      cwt.assert(unitData[5] >= 0 && unitData[5] <= type.ammo);
      cwt.assert(unitData[6] >= 0 && unitData[6] <= type.fuel);
      cwt.assert(typeof unitData[7] === "number");
      cwt.assert(unitData[8] >= -1 && unitData[8] < cwt.Player.MULTITON_INSTANCES);
      cwt.assert(unitData.length < 10 || typeof unitData[9] === "boolean");
      cwt.assert(unitData.length < 11 || typeof unitData[10] === "boolean");

      // copy data into model
      unit = cwt.Unit.getInstance(unitData[0]);
      unit.type = type;
      unit.hp = unitData[4];
      unit.ammo = unitData[5];
      unit.fuel = unitData[6];
      unit.loadedIn = (unitData[7] != cwt.INACTIVE)? cwt.Unit.getInstance(unitData[7]) : null;
      unit.owner = cwt.Player.getInstance(unitData[8]);
      unit.canAct = (typeof unitData[9] === "boolean")? unitData[9] : false;
      unit.hidden = (typeof unitData[10] === "boolean")? unitData[10] : false;
      that.data[unitData[2]][unitData[3]].unit = unit;
    }

    // reset player data
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      var player = cwt.Player.getInstance(i);
      player.name = null;
      player.gold = 0;
      player.manpower = Math.POSITIVE_INFINITY;
      player.team = (i <= data.player - 1) ? i : cwt.NOT_AVAILABLE;
    }

    // grab save game data
    if (isSave) {
      for (var i = 0, e = data.players.length; i < e; i++) {
        var playerData = data.players[i];

        // check_ data
        cwt.assert(playerData[0] >= 0 && playerData[0] < cwt.Player.MULTITON_INSTANCES);
        cwt.assert(typeof playerData[1] === "string");
        cwt.assert(playerData[3] >= 0 && playerData[3] < cwt.Player.MULTITON_INSTANCES);
        cwt.assert(playerData[2] >= 0 && playerData[2] < 999999);
        cwt.assert(playerData[4] >= 0 && playerData[4] < 999999);

        // set player data
        var player = cwt.Player.getInstance(playerData[0]);
        player.name = playerData[1];
        player.gold = playerData[2];
        player.team = playerData[3];
        player.manpower = playerData[4];
      }
    }
  }

};

/*


 (function () {

 function placeCannonMetaData(x, y) {
 var prop = model.property_posMap[x][y];
 var cannon = prop.type.cannon;
 var size = prop.type.bigProperty;

 cwt.assert(x - size.x >= 0);
 cwt.assert(y - size.y >= 0);

 var ax = x - size.actor[0];
 var ay = y - size.actor[1];
 var ox = x;
 var oy = y;
 for (var xe = x - size.x; x > xe; x--) {

 y = oy;
 for (var ye = y - size.y; y > ye; y--) {

 // place blocker
 if (x !== ox || y !== oy) {
 if (this.DEBUG) util.log("creating invisible property at", x, ",", y);
 model.events.property_createProperty(prop.owner, x, y, "PROP_INV");
 }

 // place actor
 if (x === ax && y === ay) {
 if (this.DEBUG) util.log("creating cannon unit at", x, ",", y);
 model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
 x, y, "CANNON_UNIT_INV");
 }

 }
 }
 }

 // // Places the necessary meta units for bigger properties.
 //
 model.event_on("gameround_start", function () {
 for (var x = 0, xe = model.map_width; x < xe; x++) {
 for (var y = 0, ye = model.map_height; y < ye; y++) {

 var prop = model.property_posMap[x][y];
 if (prop) {

 if (prop.type.bigProperty && prop.type.cannon) {
 placeCannonMetaData(x, y);
 } else if (prop.type.cannon) {
 if (this.DEBUG) util.log("creating cannon unit at", x, ",", y);
 model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
 x, y, "CANNON_UNIT_INV");
 } else if (prop.type.laser) {
 if (this.DEBUG) util.log("creating laser unit at", x, ",", y);
 model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
 x, y, "LASER_UNIT_INV");
 }

 }
 }
 }
 });

 })();
 */