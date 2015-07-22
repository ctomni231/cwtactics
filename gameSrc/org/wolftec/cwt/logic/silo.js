"use strict";

var constants = require("../constants");
var assert = require("../system/functions").assert;
var sheets = require("../sheets");
var model = require("../model");

//
// Returns true if a property id is a rocket silo. A rocket silo has the ability to fire a rocket to a
// position with an impact.
//
exports.isRocketSilo = function (property) {
  if (constants.DEBUG) assert(property instanceof model.Property);
  return (property.type.rocketsilo != undefined);
};

//
// Returns **true** when a silo **property** can be triggered by a given **unit**. If not, **false** will be returned.
//
exports.canBeFiredBy = function (property, unit) {
  if (constants.DEBUG) {
    assert(unit instanceof model.Unit);
    assert(exports.isRocketSilo(property));
  }

  return (property.type.rocketsilo.fireable.indexOf(unit.type.ID) > -1);
};

//
// Returns **true** if a given silo **property** can be fired to a given position (**x**,**y**). If not, **false**
// will be returned.
//
exports.canBeFiredTo = function (property, x, y) {
  if (constants.DEBUG) assert(exports.isRocketSilo(property));
  return (model.isValidPosition(x, y));
};

// inline function
var doDamage = function (x, y, tile, damage) {
  var unit = tile.unit;
  if (unit) {
    unit.takeDamage(damage, 9);
  }
};

//
// Fires a rocket from a given rocket silo at position (**x**,**y**) to a given target
// position (**tx**,**ty**) and inflicts damage to all units in the range of the explosion. The health of the units
// will be never lower as 9 health after the explosion.
//
exports.fireSilo = function (x, y, tx, ty) {
  var silo = model.mapData[x][y].property;

  if (this.DEBUG) assert(this.isRocketSilo(silo));

  // change silo type to empty
  var type = silo.type;
  silo.type = sheets.properties.sheets[type.changeTo];

  var damage = model.Unit.pointsToHealth(type.rocketsilo.damage);
  var range = type.rocketsilo.range;

  model.doInRange(tx, ty, range, doDamage, damage);
};