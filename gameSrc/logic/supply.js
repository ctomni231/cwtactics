// Returns **true** if a given **unit** is a supplier, else **false**.
//
exports.isSupplier = function (unit) {
  if (cwt.DEBUG) cwt.assert(unit instanceof cwt.UnitClass);

  return unit.type.supply;
};

//
// Returns **true** if a **supplier** unit can support a given tile at the position (**x**,**y**), else **false**.
//
exports.canSupplyTile = function (supplier, x, y) {
  if (cwt.DEBUG) cwt.assert(this.isSupplier(supplier));

  if (!cwt.Model.isValidPosition(x, y)) return false;
  return (cwt.Model.mapData[x][y].unit !== null);
};

//
// Returns **true** if a supplier at a given position (**x**,**y**) has objects nearby which can be supplied.
//
exports.hasSupplyTargetsNearby = function (x, y) {
  if (cwt.DEBUG) cwt.assert(cwt.Model.isValidPosition(x, y));

  var supplier = cwt.Model.mapData[x][y].unit;
  return (
    this.canSupplyTile(supplier, x + 1, y),
      this.canSupplyTile(supplier, x - 1, y),
      this.canSupplyTile(supplier, x, y + 1),
      this.canSupplyTile(supplier, x, y - 1)
    );
};

//
// A supplier supplies all surrounding units that can be supplied by the supplier.
//
// @param x
// @param y
//
exports.supplyNeighbours = function (x, y) {
  if (this.DEBUG) cwt.assert(cwt.Model.isValidPosition(x, y));

  var supplyUnit = cwt.Model.mapData[x][y].unit;
  if (this.DEBUG) cwt.assert(this.isSupplier(supplyUnit));

  if (this.canSupplyTile(supplyUnit, x + 1, y)) this.resupplyTargetByPos(x + 1, y);
  if (this.canSupplyTile(supplyUnit, x - 1, y)) this.resupplyTargetByPos(x - 1, y);
  if (this.canSupplyTile(supplyUnit, x, y + 1)) this.resupplyTargetByPos(x, y + 1);
  if (this.canSupplyTile(supplyUnit, x, y - 1)) this.resupplyTargetByPos(x, y - 1);
};

//
// Resupplies a unit at a given position (**x**,**y**).
//
exports.resupplyTargetByPos = function (x, y) {
  if (cwt.DEBUG) cwt.assert(cwt.Model.isValidPosition(x, y));

  var unit = cwt.Model.mapData[x][y];
  if (cwt.DEBUG) cwt.assert(unit);

  this.resupplyTarget(unit);
};

//
// Refills the supplies of the unit.
//
exports.resupplyTarget = function (unit) {
  if (cwt.DEBUG) cwt.assert(unit instanceof cwt.UnitClass);

  unit.ammo = unit.type.ammo;
  unit.fuel = unit.type.fuel;
};

//
// Drains fuel of a **unit** if it has the ability of daily fuel usage.
//
exports.drainFuel = function (unit) {
  if (this.DEBUG) cwt.assert(unit instanceof cwt.UnitClass);

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
// Raises funds from a **property**.
//
exports.raiseFunds = function (property) {
  if (typeof property.type.funds) {
    property.owner.gold += property.type.funds;
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
exports.canPropertyHeal = function (x, y) {
  var tile = cwt.Model.mapData[x][y];
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
exports.propertyHeal = function (x, y) {
  if (cwt.DEBUG) cwt.assert(this.canPropertyHeal(x, y));

  var tile = cwt.Model.mapData[x][y];
  var prop = tile.property;
  var unit = tile.unit;

  var repairs = prop.type.repairs;
  var amount = (repairs[unit.type.movetype.ID] || repairs[unit.type.ID]);

  unit.heal(amount, true);
};