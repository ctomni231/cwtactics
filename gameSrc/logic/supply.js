"use strict";

var model = require("../model");
var constants = require("../constants");

/**
 * @return **true** if a given **unit** is a supplier, else **false**.
 * 
 * @param {Unit} unit
 */
exports.isSupplier = function(unit) {
  return unit.type.supply;
};

/**
 * Returns **true** if a supplier at a given position (**x**,**y**) has
 * objects nearby which can be supplied.
 * 
 * @param {Unit} supplier
 * @param {number} x
 * @param {number} y
 * @return **true** if a **supplier** unit can support units in the near of a given tile at the position, else **false**.
 */
exports.hasRefillTargetsNearby = function(supplier, x, y) {
  if (exports.canRefillObjectAt(supplier, x + 1, y)) return true;
  else if (exports.canRefillObjectAt(supplier, x - 1, y)) return true;
  else if (exports.canRefillObjectAt(supplier, x, y + 1)) return true;
  else if (exports.canRefillObjectAt(supplier, x, y - 1)) return true;
  else return false;
};

/**
 * 
 * @param {Unit} supplier
 * @param {number} x
 * @param {number} y
 * @return **true** if a **supplier** unit can support a given tile at the position (**x**,**y**), else **false**.
 */
exports.canRefillObjectAt = function(supplier, x, y) {
  var target = model.mapData[x][y].unit;
  return (model.isValidPosition(x, y) && target && target.owner === supplier.owner);
};

/**
 * Resupplies a unit at a given position.
 * 
 * @param {number} x
 * @param {number} y
 */
exports.refillSuppliesByPosition = function(x, y) {
  var unit = model.mapData[x][y];
  exports.refillSupplies(unit);
};

/**
 * Refills the supplies of an unit.
 * 
 * @param {Unit} unit
 */
exports.refillSupplies = function(unit) {  
  unit.ammo = unit.type.ammo;
  unit.fuel = unit.type.fuel;
};

/**
 * Raises funds from a **property**.
 * 
 * @param  {Property} property
 */
exports.raiseFunds = function(property) {
  if (typeof property.type.funds) {
    property.owner.gold += property.type.funds;
  }
};

/**
 * Drains fuel of a **unit** if it has the ability of daily fuel usage.
 *
 * @param {Unit} unit
 */
exports.drainFuel = function(unit) {
  var v = unit.type.dailyFuelDrain;
  if (typeof v === "number") {

    // hidden units may drain more fuel
    if (this.hidden && this.type.dailyFuelDrainHidden) {
      v = this.type.dailyFuelDrainHidden;
    }

    this.fuel -= v;
  }
};

//
// Returns **true** if the property at the position (**x**,**y**) fulfills the following requirements
//  a) the property has a healing ability
//  b) the property is occupied by an unit of the same team
//  c) the occupying unit can be healed by the property
//
// The value **false** will be returned if one of the requirements fails.
//
exports.canPropertyRepairAt = function(x, y) {
  var tile = model.mapData[x][y];
  var prop = tile.property;
  var unit = tile.unit;
  if (prop && unit) {
    if (typeof prop.type.repairs[unit.movetype.ID] === "number") {
      return true;
    }
  }
  return false;
};

//
// The property will heal the unit that occupies the tile where the property is in. The following requirements must
// be fulfilled.
//  a) the property has a healing ability
//  b) the property is occupied by an unit of the same team
//  c) the occupying unit can be healed by the property
//
exports.propertyRepairsAt = function(x, y) {
  var tile = model.mapData[x][y];
  var prop = tile.property;
  var unit = tile.unit;

  var repairs = prop.type.repairs;
  var amount = (repairs[unit.type.movetype.ID] || repairs[unit.type.ID]);

  unit.heal(amount, true);
};
