/**
 *
 * @namespace
 */
cwt.Supply = {

  /**
   * Returns true if a given unit id represents a supplier unit.
   *
   * @param {cwt.Unit} unit
   */
  isSupplier: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    return unit.type.supply;
  },

  /**
   *
   * @param {cwt.Unit} supplier
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  canSupplyTile: function (supplier, x, y) {
    if (this.DEBUG) cwt.assert(this.isSupplier(supplier));

    if (!cwt.Map.isValidPosition(x, y)) return false;
    return (cwt.Map.data[x][y].unit !== null);
  },

  /**
   * Returns true if a given unit id has possible supply
   * targets nearby.
   */
  hasSupplyTargetsNearby: function (x, y) {
    if (this.DEBUG) cwt.assert(cwt.Map.isValidPosition(x, y));

    var supplier = cwt.Map.data[x][y].unit;
    return (
      this.canSupplyTile(supplier, x + 1, y),
        this.canSupplyTile(supplier, x - 1, y),
        this.canSupplyTile(supplier, x, y + 1),
        this.canSupplyTile(supplier, x, y - 1) );
  },

  resupplyTargetByPos: function (x, y) {
    var unit = cwt.Map.data[x][y];
    if (this.DEBUG) cwt.assert(unit);

    this.resupplyTarget(unit);
  },

  /**
   * Refills the supplies of the unit.
   *
   * @param {cwt.Unit} unit
   */
  resupplyTarget: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    unit.ammo = unit.type.ammo;
    unit.fuel = unit.type.fuel;
  },

  /**
   * A supplier supplies all surrounding units that can be supplied by the supplier.
   *
   * @param x
   * @param y
   */
  supplyNeighbours: function (x, y) {
    if (this.DEBUG) cwt.assert(cwt.Map.isValidPosition(x, y));

    var supplyUnit = cwt.Map.data[x][y].property;
    if (this.DEBUG) cwt.assert(this.isSupplier(supplyUnit));

    if (this.canSupplyTile(supplyUnit, x + 1, y)) this.resupplyTargetByPos(x + 1, y);
    if (this.canSupplyTile(supplyUnit, x - 1, y)) this.resupplyTargetByPos(x - 1, y);
    if (this.canSupplyTile(supplyUnit, x, y + 1)) this.resupplyTargetByPos(x, y + 1);
    if (this.canSupplyTile(supplyUnit, x, y - 1)) this.resupplyTargetByPos(x, y - 1);
  },

  /**
   * Drains fuel.
   *
   * @param {cwt.Unit} unit
   * @return {boolean}
   */
  drainFuel: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    var v = unit.type.dailyFuelDrain;
    if (typeof v === "number") {

      // hidden units may drain more fuel
      if (this.hidden && this.type.dailyFuelDrainHidden) {
        v = this.type.dailyFuelDrainHidden;
      }

      this.fuel -= v;
    }
  },

  /**
   *
   * @param property
   */
  raiseFunds: function (property) {
    if (typeof property.type.funds !== "number") return;
    property.owner.gold += property.type.funds;

    cwt.ClientEvents.goldChange(property.owner, property.type.funds, x, y);
  },

  canPropertyHeal: function (x, y) {
    var tile = cwt.Map.data[x][y];
    var prop = tile.property;
    var unit = tile.unit;
    if (prop && unit) {
      if (typeof prop.type.repairs[unit.movetype.ID] === "number") {
        return true;
      }
    }
    return false;
  },

  propertyHeal: function (x, y) {
    if (this.DEBUG) cwt.assert(this.canPropertyHeal(x, y));

    var tile = cwt.Map.data[x][y];
    var prop = tile.property;
    var unit = tile.unit;

    unit.heal( prop.type.repairs[unit.movetype.ID], true );
  }

};