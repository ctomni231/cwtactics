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
  }

};