/**
 *
 * @namespace
 */
cwt.Explode = {

  /**
   * Returns `true` if a unit id is a suicide unit. A suicide unit
   * has the ability to blow itself up with an impact.
   *
   * @param {cwt.Unit} unit
   */
  canExplode: function (unit) {
    if (DEBUG) assert(unit instanceof cwt.Unit);

    return unit.type.suicide !== undefined;
  },

  /**
   * Returns the explosion damage of an exploder.
   *
   * @param unit
   * @return {number}
   */
  getExplosionDamage: function (unit) {
    return cwt.Unit.pointsToHealth(unit.type.suicide.damage);
  },

  /**
   * Returns the explosion range of an exploder.
   *
   * @param unit
   * @return {number}
   */
  getExplosionRange: function (unit) {
    return unit.type.suicide.range;
  },

  /**
   *
   */
  explode: function (x, y, range, damage) {
    if (DEBUG) assert(this.canExplode(cwt.Gameround.map.data[x][y].unit));
    if (DEBUG) assert(range >= 1);

    // TODO self-destroy

    cwt.Gameround.map.doInRange(x, y, range, this.exploderDamage_, damage);
  },

  /**
   *
   */
  exploderDamage_: function (x, y, damage) {
    var unit = cwt.Gameround.map.data[x][y].unit;
    if (unit) {
      unit.takeDamage(damage, 9);
    }
  }

};