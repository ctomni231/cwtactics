"use strict";

var constants = require("./constants");

var assert = require("./functions").assert;

var createBuffer = require("./circularBuffer").createBufferByClass;

var daysOfPeaceCfg = require("./config").getConfig("daysOfPeace");

// Advance Wars 1 game mode. The first ever released game mode of the advance wars series (GBA and up).
//
var GAME_MODE_AW1 = 0;

// Advance Wars 2 game mode. It introduced the Super CO Power.
//
var GAME_MODE_AW2 = 1;

//
// Object that holds information about objects at a given position (x,y).
//
// @class
//
exports.PositionData = my.Class({

  constructor: function() {
    this.clean();
  },

  //
  // Cleans all data of the object.
  //
  clean: function() {
    this.x = -1;
    this.y = -1;
    this.tile = null;
    this.unit = null;
    this.property = null;
    this.unitId = -1;
    this.propertyId = -1;
  },

  //
  // Grabs the data from another position object.
  //
  grab: function(otherPos) {
    cwt.assert(otherPos instanceof cwt.Position);

    this.x = otherPos.x;
    this.y = otherPos.y;
    this.tile = otherPos.tile;
    this.unit = otherPos.unit;
    this.unitId = otherPos.unitId;
    this.property = otherPos.property;
    this.propertyId = otherPos.propertyId;
  },

  //
  // Sets a position.
  //
  set: function(x, y) {
    this.clean();

    this.x = x;
    this.y = y;
    this.tile = cwt.Map.data[x][y];

    if (this.tile.turnOwnerVisible && this.tile.unit) {
      this.unit = null;
      this.unitId = cwt.Unit.getInstanceId(this.tile.unit);
    }

    if (this.tile.property) {
      this.property = this.tile.property;
      this.propertyId = cwt.Property.getInstanceId(this.tile.property);
    }
  }
});

//
//
// @class
//
exports.Tile = my.Class({

  STATIC: {

    fromJSON: function(data) {

    },

    toJSON: function() {

    }
  },

  constructor: function() {
    this.type = null;
    this.unit = null;
    this.property = null;
    this.visionTurnOwner = 0;
    this.variant = 0;
    this.visionClient = 0;
  },

  //
  //
  // @return {boolean}
  //
  isOccupied: function() {
    return this.unit !== null;
  },

  //
  //
  // @return {boolean}
  //
  isVisible: function() {
    return this.visionTurnOwner > 0;
  }

});

//
// @class
// @extends cwt.IndexMultiton
//
exports.Property = my.Class({

  STATIC: {

    fromJSON: function(data) {

    },

    toJSON: function() {

    },

    CAPTURE_POINTS: 20,

    CAPTURE_STEP: 10
  },

  constructor: function() {
    this.points = 20;

    //
    // @type {cwt.Player}
    //
    this.owner = null;

    this.type = null;
  },

  //
  // Returns true, when the given property is neutral, else false.
  //
  isNeutral: function() {
    return this.owner === null;
  },

  makeNeutral: function() {
    this.owner = null;
  }

});

// Player class which holds all parameters of a army owner.
//
exports.Player = my.Class({

  STATIC: {

    fromJSON: function(data) {

    },

    toJSON: function() {

    }
  },

  constructor: function() {
    this.ID = -1;
    this.reset();
  },

  isPowerActive: function(level) {
    return this.activePower === level;
  },

  isInactive: function() {
    return this.team != cwt.INACTIVE;
  },

  deactivate: function() {
    this.team = cwt.INACTIVE;
  },

  activate: function(teamNumber) {
    this.team = teamNumber;
  },

  reset: function() {
    this.team = cwt.INACTIVE;
    this.name = null;

    this.coA = null;
    this.activePower = cwt.INACTIVE;
    this.power = 0;
    this.powerUsed = 0;

    this.gold = 0;
    this.manpower = Math.POSITIVE_INFINITY;

    this.numberOfUnits = 0;
    this.numberOfProperties = 0;

    this.turnOwnerVisible = false;
    this.clientVisible = false;
    this.clientControlled = false;
  }
});

//
//
// @class
// @extends cwt.IndexMultiton.<T>
//
exports.Unit = my.Class({

  STATIC: {

    //
    // Converts HP points to a health value.
    //
    // @return {number}
    //
    // @example
    //    6 HP -> 60 health
    //    3 HP -> 30 health
    //
    pointsToHealth: function(pt) {
      return (pt * 10);
    },

    //
    // Converts and returns the HP points from the health
    // value of an unit.
    //
    // @example
    //   health ->  HP
    //     69   ->   7
    //     05   ->   1
    //     50   ->   6
    //     99   ->  10
    //
    healthToPoints: function(health) {
      return parseInt(health / 10, 10) + 1;
    },

    //
    // Gets the rest of unit health.
    //
    healthToPointsRest: function(health) {
      return health - (parseInt(health / 10) + 1);
    },

    fromJSON: function(data) {

    },

    toJSON: function() {

    }
  },

  constructor: function() {
    this.hp = 99;
    this.ammo = 0;
    this.fuel = 0;
    this.hidden = false;
    this.loadedIn = cwt.INACTIVE;
    this.type = null;
    this.canAct = false;

    // If the value is null then unit does not exists on the map.
    this.owner = null;
  },

  initByType: function(type) {

  },

  isInactive: function() {
    return this.owner === null;
  },

  //
  // Damages a unit.
  //
  takeDamage: function(damage, minRest) {
    this.hp -= damage;

    if (minRest && this.hp <= minRest) {
      this.hp = minRest;
    }
  },

  //
  // Heals an unit. If the unit health will be greater than the maximum
  // health value then the difference will be added as gold to the
  // owners gold depot.
  //
  heal: function(health, diffAsGold) {
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

  //
  // @return {boolean} true when hp is greater than 0 else false
  //
  isAlive: function() {
    return this.hp > 0;
  },

  //
  // Returns true when the unit ammo is lower equals 25%.
  //
  // @return {boolean}
  //
  hasLowAmmo: function() {
    var cAmmo = this.ammo;
    var mAmmo = this.type.ammo;
    if (mAmmo != 0 && cAmmo <= parseInt(mAmmo * 0.25, 10)) {
      return true;
    } else {
      return false;
    }
  },

  //
  // Returns true when the unit fuel is lower equals 25%.
  //
  // @return {boolean}
  //
  hasLowFuel: function() {
    var cFuel = this.fuel;
    var mFuel = this.type.fuel;
    if (cFuel <= parseInt(mFuel * 0.25, 10)) {
      return true;
    } else {
      return false;
    }
  },

  isCapturing: function() {
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
});

// The active weather type object.
//
exports.weather = null;

// The amount of days until the weather will be changed.
//
exports.weatherLeftDays = 0;

// The current active commanders mode.
//
exports.gameMode = 0;

// The current active day.
//
exports.day = 0;

// The current active turn owner. Only the turn owner can do actions.
//
exports.turnOwner = null;

// Maximum turn time limit in ms.
//
exports.turnTimeLimit = 0;

// Current elapsed turn time in ms.
//
exports.turnTimeElapsed = 0;

// Maximum game time limit in ms.
//
exports.gameTimeLimit = 0;

// Current elapsed game time in ms.
//
exports.gameTimeElapsed = 0;

//
//
exports.mapWidth = 0;

//
//
exports.mapHeight = 0;


// generate map matrix
var matrix = new require("./matrix").Matrix(constants.MAX_MAP_WIDTH, constants.MAX_MAP_HEIGHT);
for (var x = 0, xe = constants.MAX_MAP_WIDTH; x < xe; x++) {
  for (var y = 0, ye = constants.MAX_MAP_HEIGHT; y < ye; y++) {
    matrix.data[x][y] = new exports.Tile();
  }
}

//
//
exports.mapData = matrix.data;

// All player objects of a game round. This buffer holds the maximum amount of possible player objects. Inactive
// ones are marked by the inactive marker as team value.
//
exports.players = createBuffer(exports.Player, constants.MAX_PLAYER);

// set player id's
exports.players.forEach(function (player, i) {
  player.id = i;
});

// All unit objects of a game round. This buffer holds the maximum amount of possible unit objects. Inactive
// ones are marked by no reference in the map and with an owner value **null**.
//
exports.units = createBuffer(exports.Unit, constants.MAX_PLAYER * constants.MAX_UNITS);

// All property objects of a game round. This buffer holds the maximum amount of possible property objects. Inactive
// ones are marked by no reference in the map.
//
exports.properties = createBuffer(exports.Property, constants.MAX_PROPERTIES);

//
// Returns the distance of two positions.
//
exports.getDistance = function (sx, sy, tx, ty) {
  if (this.DEBUG) assert(exports.isValidPosition(sx, sy));
  if (this.DEBUG) assert(exports.isValidPosition(tx, ty));

  return Math.abs(sx - tx) + Math.abs(sy - ty);
};

//
// Returns true if the given position (x,y) is valid on the current
// active map, else false.
//
exports.isValidPosition = function (x, y) {
  return (x >= 0 && y >= 0 && x < exports.mapWidth && y < exports.mapHeight);
};

// Returns the **tile** which is occupied by a given **unit**.
//
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
};

//
//
// @param property
// @param cb
// @param cbThis
// @param arg
//
exports.searchProperty = function (property, cb, cbThis, arg) {
  for (var x = 0, xe = exports.mapWidth; x < xe; x++) {
    for (var y = 0, ye = exports.mapHeight; y < ye; y++) {
      if (exports.mapData[x][y].unit === unit) {
        cb.call(cbThis, x, y, property, arg);
      }
    }
  }
};

//
//
// @param unit
// @param cb
// @param cbThis
// @param {Object=} arg
//
exports.searchUnit = function (unit, cb, cbThis, arg) {
  for (var x = 0, xe = exports.mapWidth; x < xe; x++) {
    for (var y = 0, ye = exports.mapHeight; y < ye; y++) {
      if (exports.mapData[x][y].unit === unit) {
        return cb.call(cbThis, x, y, unit, arg);
      }
    }
  }
};

// Invokes a callback on all tiles in a given range at a position (x,y).
//
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

// Returns `true` when at least two opposite teams are left, else `false`.
//
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

// Returns true if the given player id is the current turn owner.
//
exports.isTurnOwner = function (player) {
  return exports.turnOwner === player;
};

// Converts a number of days into turns.
//
exports.convertDaysToTurns = function (days) {
  return constants.MAX_PLAYER * days;
};

//
// Returns `true` when the game is in the peace phase.
//
exports.inPeacePhase = function () {
  return (exports.day < daysOfPeaceCfg.value);
};

//
//
// @param {cwt.Unit|cwt.Property|null} obj
// @return {boolean}
//
exports.isTurnOwnerObject = function (obj) {
  return (obj != null && obj.owner === exports.turnOwner);
};

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
 //
 });

 // use index based multiton trait
 //my.extendClass(cwt.Unit,{STATIC:cwt.IndexMultiton});

 */