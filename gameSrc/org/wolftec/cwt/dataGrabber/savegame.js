"use strict";

var constants = require("../constants");
var storage = require("../storage");
var config = require("../config");
var sheets = require("../sheets");
var model = require("../model");

var assert = require("../system/functions").assert;

exports.save = function (name, cb) {
  var saveData = {};

  saveData.mpw = model.mapWidth;
  saveData.mph = model.mapHeight;
  saveData.map = [];
  saveData.prps = [];
  saveData.units = [];

  // generates ID map
  var mostIdsMap = {};
  var mostIdsMapCurIndex = 0;
  for (var x = 0, xe = model.mapWidth; x < xe; x++) {

    saveData.map[x] = [];
    for (var y = 0, ye = model.mapHeight; y < ye; y++) {
      var type = model.mapData[x][y].type.ID;

      // create number for type
      if (!mostIdsMap.hasOwnProperty(type)) {
        mostIdsMap[type] = mostIdsMapCurIndex;
        mostIdsMapCurIndex++;
      }

      saveData.map[x][y] = mostIdsMap[type];

      // save property
      var prop = model.mapData[x][y].property;
      if (prop) {
        saveData.prps.push([
          model.properties.indexOf(prop),
          x,
          y,
          prop.type.ID,
          prop.capturePoints,
          prop.owner.id
        ]);
      }

      // save unit
      var unit = model.mapData[x][y].unit;
      if (unit) {
        saveData.units.push([
          model.units.indexOf(unit),
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
  saveData.typeMap = [];
  var typeKeys = Object.keys(mostIdsMap);
  for (var i = 0, e = typeKeys.length; i < e; i++) {
    saveData.typeMap[mostIdsMap[typeKeys[i]]] = typeKeys[i];
  }

  saveData.wth = model.weather.ID;
  saveData.day = model.day;
  saveData.trOw = model.turnOwner.id;
  saveData.gmTm = model.gameTimeElapsed;
  saveData.tnTm = model.turnTimeElapsed;

  saveData.cfg = {};
  for (var i = 0, e = config.gameConfigNames.length; i < e; i++) {
    var key = config.gameConfigNames[i];
    saveData.cfg[key] = config.Config.getValue(key);
  }

  storage.set("SAVE_"+name, JSON.stringify(saveData), cb);
};

exports.loadSave = function (name, callback) {
  exports.initMap(storage.get("SAVE_"+name, function (value) {
    exports.initMap(value, true, callback);
  }));
};

// TODO add json schema validation
exports.initMap = function (gameData, isSave, callback) {
  var property;
  var unit;

  model.mapWidth = gameData.mpw;
  model.mapHeight = gameData.mph;

  // map
  for (var x = 0, xe = model.mapWidth; x < xe; x++) {
    for (var y = 0, ye = model.mapHeight; y < ye; y++) {
      model.mapData[x][y].type = sheets.tiles.sheets[gameData.typeMap[gameData.map[x][y]]];
    }
  }

  // prepare properties
  for (var i = 0, e = model.properties.length; i < e; i++) {
    property = model.properties[i];
    if (property) {
      property.owner = null;
      property.type = null;
      property.capturePoints = 20;
    }
  }

  // saved properties
  for (var i = 0, e = gameData.prps.length; i < e; i++) {
    var propData = gameData.prps[i];

    // copy data into model
    property = model.properties[propData[0]];
    property.type = sheets.properties.sheets[propData[3]];
    property.capturePoints = propData[4];
    property.owner = (propData[5] != constants.INACTIVE) ? model.players[propData[5]] : null;
    model.mapData[propData[1]][propData[2]].property = property;
  }

  // prepare units
  for (var i = 0, e = model.units.length; i < e; i++) {
    unit = model.units[i];
    if (unit) {
      unit.owner = null;
      unit.canAct = false;
    }
  }

  // saved units
  for (var i = 0, e = gameData.units.length; i < e; i++) {
    var unitData = gameData.units[i];

    // copy data into model
    unit = model.units[unitData[0]];
    unit.type = sheets.units.sheets[unitData[1]];
    unit.hp = unitData[4];
    unit.ammo = unitData[5];
    unit.fuel = unitData[6];
    unit.loadedIn = (unitData[7] != constants.INACTIVE) ? model.units[unitData[7]] : null;
    unit.owner = model.players[unitData[8]];
    unit.canAct = (unitData.length >= 10 && typeof unitData[9] === "boolean") ? unitData[9] : true;
    unit.hidden = (unitData.length >= 11 && typeof unitData[10] === "boolean") ? unitData[10] : false;
    model.mapData[unitData[2]][unitData[3]].unit = unit;
  }

  // reset player data
  for (var i = 0, e = model.players.length; i < e; i++) {
    var player = model.players[i];
    player.name = null;
    player.gold = 0;
    player.manpower = 999999;
    player.team = (i <= gameData.player - 1) ? i : constants.NOT_AVAILABLE;
  }

  // grab save game data
  if (isSave) {
    for (var i = 0, e = gameData.players.length; i < e; i++) {
      var playerData = gameData.players[i];

      // set player data
      var player = model.players[playerData[0]];
      player.name = playerData[1];
      player.gold = playerData[2];
      player.team = playerData[3];
      player.manpower = playerData[4];
    }
  }

  model.weather = sheets.defaultWeather;
  model.turnOwner = model.players[0];
  model.day = 0;

  if (isSave) {
    model.weather = sheets.weathers.sheets[gameData.wth];
    model.turnOwner = model.players[gameData.trOw];
    model.day = data.day;
    model.gameTimeElapsed = data.gmTm;
    model.turnTimeElapsed = data.tnTm;
  }

  config.resetValues();
  if (isSave && data.cfg) {
    for (var i = 0, e = config.gameConfigNames.length; i < e; i++) {
      var key = config.gameConfigNames[i];
      if (data.cfg[key]) {
        config.getConfig(key).setValue(data.cfg[key]);
      }
    }
  }

  // invoke callback
  callback();
};

/*
 cwt.assert(Array.isArray(data.units));
 cwt.assert(Array.isArray(data.prps));
 cwt.assert(cwt.WeatherSheet.sheets.hasOwnProperty(data.wth));
 cwt.assert(data.trOw >= 0 && data.trOw < 9999999);
 cwt.assert(data.day >= 0 && data.day < 9999999);
 cwt.assert(data.gmTm >= 0);
 cwt.assert(data.tnTm >= 0);
 // check_ data
 cwt.assert(playerData[0] >= 0 && playerData[0] < cwt.Player.MULTITON_INSTANCES);
 cwt.assert(typeof playerData[1] === "string");
 cwt.assert(playerData[3] >= 0 && playerData[3] < cwt.Player.MULTITON_INSTANCES);
 cwt.assert(playerData[2] >= 0 && playerData[2] < 999999);
 cwt.assert(playerData[4] >= 0 && playerData[4] < 999999);

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
 //*/
