//
// Module to control and use the suicide and explosion abilities.
//
cwt.Explode = {

  // Returns **true** if the **unit** is capable to self destruct.
  //
  canSelfDestruct: function (unit) {
    if (cwt.DEBUG) cwt.assert(unit instanceof cwt.UnitClass);

    return unit.type.suicide !== undefined;
  },

  // Returns the **health** that will be damaged by an explosion of the exploder **unit**.
  //
  getExplosionDamage: function (unit) {
    if (cwt.DEBUG) cwt.assert(this.canSelfDestruct(unit));

    return cwt.UnitClass.pointsToHealth(unit.type.suicide.damage);
  },

  // Returns the explosion **range** of the exploder **unit**.
  //
  getSuicideRange: function (unit) {
    if (cwt.DEBUG) cwt.assert(this.canSelfDestruct(unit));

    return unit.type.suicide.range;
  },

  // Invokes an explosion with a given **range** at position (**x**,**y**). All units in the **range** will be damaged
  // by the value **damage**. The health of an unit in range will never be lower than 9 health after the explosion (
  // means it will have 1HP left).
  //
  explode: (function () {

    // TODO: silo should use this for the impact

    function doDamage(x, y, tile, damage) {
      var unit = tile.unit;
      if (unit) {
        unit.takeDamage(damage, 9);
      }
    }

    return function (x, y, range, damage) {
      if (this.DEBUG) {
        cwt.assert(this.canSelfDestruct(cwt.Model.mapData[x][y].unit));
        cwt.assert(range >= 1);
        cwt.assert(damage >= 1);
      }

      cwt.Lifecycle.destroyUnit(x, y, false);
      cwt.Model.doInRange(x, y, range, doDamage, damage);
    }
  })()

};
