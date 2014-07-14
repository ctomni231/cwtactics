//
// Logic for the rocket silo mechanic.
//
// @namespace
//
cwt.Silo = {

  //
  // Returns true if a property id is a rocket silo. A rocket silo
  // has the ability to fire a rocket to a position with an impact.
  //
  // @param property
  // @return {boolean}
  //
  isRocketSilo: function(property) {
    if (this.DEBUG) cwt.assert(property instanceof cwt.Property);

    if (!property.type.rocketsilo) return false;
    return true;
  },

  //
  //
  // @param property
  // @param unit
  // @return {boolean}
  //
  canBeFiredBy: function(property, unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);
    if (this.DEBUG) cwt.assert(this.isRocketSilo(property));

    if (property.type.rocketsilo.fireable.indexOf(unit.type.ID) === -1) {
      return false;
    }

    return true;
  },

  //
  // Returns true if a property id is a rocket silo. A rocket silo
  // has the ability to fire a rocket to a position with an impact.
  //
  // @param property
  // @param unit
  // @return {boolean}
  //
  canBeFired: function(property, unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    if (this.type.rocketsilo.fireable.indexOf(unit.type.ID) === -1) return false;
    return true;
  },

  //
  //
  // @param property
  // @param x
  // @param y
  // @return {boolean}
  //
  canBeFiredTo: function(property, x, y) {
    if (this.DEBUG) cwt.assert(property instanceof cwt.Property);

    if (!cwt.Map.isValidPosition(x, y)) return false;
  },

  //
  // Fires a rocket to a given position (x,y) and inflicts damage to
  // all units in a range around the position.
  //
  // @param x
  // @param y
  // @param tx
  // @param ty
  // @param owner
  //
  fireSilo: function(x, y, tx, ty, owner) {
    var silo = cwt.Map.data[x][y].property;

    if (this.DEBUG) cwt.assert(silo);
    if (this.DEBUG) cwt.assert(this.isRocketSilo(silo));

    var type = silo.type;
    var targetType = cwt.PropertySheet.sheets[type.changeTo];

    cwt.ClientEvents.propertyTypeChanged(silo, silo.type, targetType);
    silo.type = targetType;

    var damage = cwt.Unit.pointsToHealth(type.rocketsilo.damage);
    var range = type.rocketsilo.range;

    cwt.Map.doInRange(tx, ty, range, this.exploderDamage_, damage);
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
