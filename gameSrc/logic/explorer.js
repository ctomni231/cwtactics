/**
 *
 * @namespace
 */
cwt.Suicide = {

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
   *
   */
  explode: function (tx, ty, range, damage, owner) {
    cwt.Gameround.map.doInRange(
      tx, ty,
      range,
      this.exploderDamage_,
      damage
    );
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