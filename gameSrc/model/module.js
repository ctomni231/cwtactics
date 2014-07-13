"use strict";

cwt.Model = {

  // Advance Wars 1 game mode. The first ever released game mode of the advance wars series (GBA and up).
  //
  GAME_MODE_AW1: 0,

  // Advance Wars 2 game mode. It introduced the Super CO Power.
  //
  GAME_MODE_AW2: 1,

  // The active weather type object.
  //
  weather: null,

  // The amount of days until the weather will be changed.
  //
  weatherLeftDays: 0,

  // The current active commanders mode.
  //
  gameMode: 0,

  // The current active day.
  //
  day: 0,

  // The current active turn owner. Only the turn owner can do actions.
  //
  turnOwner: null,

  // Maximum turn time limit in ms.
  //
  turnTimeLimit: 0,

  // Current elapsed turn time in ms.
  //
  turnTimeElapsed: 0,

  // Maximum game time limit in ms.
  //
  gameTimeLimit: 0,

  // Current elapsed game time in ms.
  //
  gameTimeElapsed: 0,

  mapWidth: 0,

  mapHeight: 0,

  mapData: null,

  // All player objects of a game round. This buffer holds the maximum amount of possible player objects. Inactive
  // ones are marked by the inactive marker as team value.
  //
  players: cwt.CircularBuffer.createByClass(cwt.PlayerClass, cwt.MAX_PLAYER),

  // All unit objects of a game round. This buffer holds the maximum amount of possible unit objects. Inactive
  // ones are marked by no reference in the map and with an owner value **null**.
  //
  units: cwt.CircularBuffer.createByClass(cwt.UnitClass, cwt.MAX_PLAYER * cwt.MAX_UNITS),

  // All property objects of a game round. This buffer holds the maximum amount of possible property objects. Inactive
  // ones are marked by no reference in the map.
  //
  properties: cwt.CircularBuffer.createByClass(cwt.PropertyClass, cwt.MAX_PROPERTIES),

  $afterLoad: function()  {

    // set player id's
    this.players.forEach(function(player, i) {
      player.id = i;
    });

    // generate map matrix
    var matrix = new cwt.Matrix(cwt.MAX_MAP_WIDTH, cwt.MAX_MAP_HEIGHT);
    for (var x = 0, xe = cwt.MAX_MAP_WIDTH; x < xe; x++) {
      for (var y = 0, ye = cwt.MAX_MAP_HEIGHT; y < ye; y++) {
        matrix.data[x][y] = new cwtTileClass();
      }
    }
    this.mapData = matrix.data;
  },

  //
  // Returns the distance of two positions.
  //
  getDistance: function(sx, sy, tx, ty) {
    if (this.DEBUG) cwt.assert(this.isValidPosition(sx, sy));
    if (this.DEBUG) cwt.assert(this.isValidPosition(tx, ty));

    return Math.abs(sx - tx) + Math.abs(sy - ty);
  },

  //
  // Returns true if the given position (x,y) is valid on the current
  // active map, else false.
  //
  isValidPosition: function(x, y) {
    return (x >= 0 && y >= 0 && x < this.mapWidth && y < this.mapHeight);
  },

  //
  //
  // @param property
  // @param cb
  // @param cbThis
  // @param arg
  //
  searchProperty: function(property, cb, cbThis, arg) {
    for (var x = 0, xe = this.mapWidth; x < xe; x++) {
      for (var y = 0, ye = this.mapHeight; y < ye; y++) {
        if (this.mapData[x][y].unit === unit) {
          cb.call(cbThis, x, y, property, arg);
        }
      }
    }
  },

  //
  //
  // @param unit
  // @param cb
  // @param cbThis
  // @param {Object=} arg
  //
  searchUnit: function(unit, cb, cbThis, arg) {
    for (var x = 0, xe = this.mapWidth; x < xe; x++) {
      for (var y = 0, ye = this.mapHeight; y < ye; y++) {
        if (this.mapData[x][y].unit === unit) {
          return cb.call(cbThis, x, y, unit, arg);
        }
      }
    }
  },

  //
  // Invokes a callback on all tiles in a given range at a position (x,y).
  //
  doInRange: function(x, y, range, cb, arg) {
    if (this.DEBUG) cwt.assert(this.isValidPosition(x, y));
    if (this.DEBUG) cwt.assert(typeof cb === "function");
    if (this.DEBUG) cwt.assert(range >= 0);

    var lX;
    var hX;
    var lY = y - range;
    var hY = y + range;
    if (lY < 0) lY = 0;
    if (hY >= this.mapHeight) hY = this.mapHeight - 1;
    for (; lY <= hY; lY++) {

      var disY = Math.abs(lY - y);
      lX = x - range + disY;
      hX = x + range - disY;
      if (lX < 0) lX = 0;
      if (hX >= this.mapWidth) hX = this.mapWidth - 1;
      for (; lX <= hX; lX++) {

        // invoke the callback on all tiles in range
        // if a callback returns `false` then the process will be stopped
        if (cb(lX, lY, this.mapData[lX][lY], arg, Math.abs(lX - x) + disY) === false) return;

      }
    }
  },

  // Returns `true` when at least two opposite teams are left, else `false`.
  //
  areEnemyTeamsLeft: function() {
    var player;
    var foundTeam = -1;
    var i = 0;
    var e = cwt.MAX_PLAYER;

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
  },

  // Returns true if the given player id is the current turn owner.
  //
  isTurnOwner: function(player) {
    return this.turnOwner === player;
  },

  // Converts a number of days into turns.
  //
  convertDaysToTurns: function(days) {
    return cwt.MAX_PLAYER * days;
  },

  //
  // Returns `true` when the game is in the peace phase.
  //
  inPeacePhase: function() {
    return (this.day < cwt.Config.getValue("daysOfPeace"));
  },

  //
  //
  // @param {cwt.Unit|cwt.Property|null} obj
  // @return {boolean}
  //
  isTurnOwnerObject: function(obj) {
    return (obj != null && obj.owner === this.turnOwner);
  }
};
