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
    if (DEBUG) assert(unit instanceof cwt.Unit);

    return unit.type.supply;
  },

  /**
   * Returns true if a given unit id has possible supply
   * targets nearby.
   */
  hasSupplyTargetsNearby: function (x, y) {
    if (this.loadedIn !== INACTIVE_ID) return false;

    assert(model.map_isValidPosition(x, y));
    if (!model.supply_isSupplyUnit(uid)) return false;

    return true;
  },

  /**
   * Refills the supplies of the unit.
   *
   * @param {cwt.Unit} unit
   */
  resupplyTarget: function (unit) {
    if (DEBUG) assert(unit instanceof cwt.Unit);

    unit.ammo = unit.type.ammo;
    unit.fuel = unit.type.fuel;
  },

  /**
   * A supplier supplies all surrounding units that can be supplied by the supplier.
   *
   * @param {cwt.Unit} supplyUnit
   */
  supplyNeighbours: function (supplyUnit) {
    if (DEBUG) assert(supplyUnit instanceof cwt.Unit);
    if (DEBUG) assert(this.isSupplier(supplyUnit));

    for (var i= 0,e=cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
      if (!model.unit_isValidUnitId(i)) continue;

      // supply when neighbor
      if (model.unit_getDistance(sid, i) === 1) {
        model.events.supply_refillResources(i);
      }
    }
  },

  /**
   * Drains fuel. When the unit does not have enough fuel then it
   * will be removed from game and the event will be stopped.
   *
   * @param uid
   * @return {Boolean}
   */
  drainFuel: function (uid) {
    var v = this.type.dailyFuelDrain;
    if (typeof v === "number") {

      // hidden units may drain more fuel
      if (this.hidden && this.type.dailyFuelDrainHidden) {
        v = this.type.dailyFuelDrainHidden;
      }

      this.fuel -= v;

      // if fuel is empty then destroy it
      if (this.fuel <= 0) {
        this.destroy();
      }
    }
  },

  /**
   * Gives funds.
   */
  raiseFunds: function () {
    if (typeof this.type.funds !== "number") return;
    this.owner.gold += this.type.funds;

    cwt.ClientEvents.goldChange(this.owner, this.type.funds);
  }

};