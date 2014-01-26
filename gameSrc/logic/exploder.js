my.extendClass(cwt.Unit, {

  /**
   * Returns `true` if a unit id is a suicide unit. A suicide unit
   * has the ability to blow itself up with an impact.
   */
  isExploder: function () {
    return this.type.suicide !== void 0;
  },

  /**
   *
   */
  exploderDamage_: function (x, y, damage) {
    var unit = model.unit_posData[x][y];
    if (unit) model.events.damageUnit(model.unit_extractId(unit), damage, 9);
  },

  /**
   *
   */
  explodeSelf: function (tx, ty, range, damage, owner) {
    model.map_doInRange(tx, ty, range, this.exploderDamage_, damage);
  }
});