"use strict";

var assert = require("../system/functions").assert;
var constants = require("../constants");
var sheets = require("../sheets");
var model = require("../model");

// Returns **true** when the given **unit** is the mechanical laser trigger, else **false**.
//
exports.isLaser = function (unit) {
  if (constants.DEBUG) assert(unit instanceof model.Unit);
  return (unit.type.ID === sheets.LASER_UNIT_INV);
};

// Fires a laser at a given position (**x**,**y**).
//
exports.fireLaser = function (x, y) {
  var map = model.mapData;
  var prop = map[x][y].property;

  if (constants.DEBUG) assert(prop && prop.type.laser);

  var ox = x;
  var oy = y;
  var savedTeam = prop.owner.team;
  var damage = model.Unit.pointsToHealth(prop.type.laser.damage);

  // every tile on the cross ( same y or x coordinate ) will be damaged
  for (var x = 0, xe = model.mapWidth; x < xe; x++) {
    var doIt = false;

    if (x === ox) {
      for (var y = 0, ye = model.mapHeight; y < ye; y++) {
        if (oy !== y) {
          var unit = map[x][y].unit;
          if (unit && unit.owner.team !== savedTeam) {
            unit.takeDamage(damage, 9);
          }
        }
      }
    } else {
      var unit = map[x][y].unit;
      if (unit && unit.owner.team !== savedTeam) {
        unit.takeDamage(damage, 9);
      }
    }
  }
};