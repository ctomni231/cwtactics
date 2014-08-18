"use strict";

var constants = require("../constants");
var assert = require("../system/functions").assert;
var model = require("../model");

// Returns **true** if the **unit** is capable to self destruct.
//
exports.canSelfDestruct = function (unit) {
  if (constants.DEBUG) assert(unit instanceof model.Unit);
  return unit.type.suicide !== undefined;
};

// Returns the **health** that will be damaged by an explosion of the exploder **unit**.
//
exports.getExplosionDamage = function (unit) {
  if (constants.DEBUG) assert(exports.canSelfDestruct(unit));
  return model.Unit.pointsToHealth(unit.type.suicide.damage);
};

// Returns the explosion **range** of the exploder **unit**.
//
exports.getSuicideRange = function (unit) {
  if (constants.DEBUG) assert(exports.canSelfDestruct(unit));
  return unit.type.suicide.range;
};

var doDamage = function(x, y, tile, damage) {
  var unit = tile.unit;
  if (unit) {
    unit.takeDamage(damage, 9);
  }
}
// TODO: silo should use this for the impact


// Invokes an explosion with a given **range** at position (**x**,**y**). All units in the **range** will be damaged
// by the value **damage**. The health of an unit in range will never be lower than 9 health after the explosion (
// means it will have 1HP left).
//
exports.explode = function (x, y, range, damage) {
  if (constants.DEBUG) assert(exports.canSelfDestruct(model.mapData[x][y].unit) && range >= 1 && damage >= 1);

  cwt.Lifecycle.destroyUnit(x, y, false);
  model.doInRange(x, y, range, doDamage, damage);
};