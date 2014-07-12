//
//
// @namespace
//
cwt.Explode = {

  //
  // Returns `true` if a unit id is a suicide unit. A suicide unit
  // has the ability to blow itself up with an impact.
  //
  // @param {cwt.Unit} unit
  //
  canExplode: function(unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    return unit.type.suicide !== undefined;
  },

  //
  // Returns the explosion damage of an exploder.
  //
  // @param unit
  // @return {number}
  //
  getExplosionDamage: function(unit) {
    return cwt.Unit.pointsToHealth(unit.type.suicide.damage);
  },

  //
  // Returns the explosion range of an exploder.
  //
  // @param unit
  // @return {number}
  //
  getExplosionRange: function(unit) {
    return unit.type.suicide.range;
  },

  //
  //
  // @param {number} x
  // @param {number} y
  // @param {number} range (x >= 1)
  // @param {number} damage (x >= 0)
  //
  explode: function(x, y, range, damage) {
    if (this.DEBUG) cwt.assert(this.canExplode(cwt.Gameround.map.data[x][y].unit));
    if (this.DEBUG) cwt.assert(range >= 1);

    cwt.Lifecycle.destroyUnit(x, y, false);
    cwt.Gameround.map.doInRange(x, y, range, this.exploderDamage_, damage);
  },

  //
  //
  // @param {number} x
  // @param {number} y
  // @param {number} damage (x >= 0)
  // @private
  //
  exploderDamage_: function(x, y, tile, damage) {
    var unit = tile.unit;
    if (unit) {
      unit.takeDamage(damage, 9);
    }
  }

};
