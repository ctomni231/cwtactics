/**
 * Logic for the rocket silo mechanic.
 *
 * @namespace
 */
cwt.Silo = {

  /**
   * Returns true if a property id is a rocket silo. A rocket silo
   * has the ability to fire a rocket to a position with an impact.
   */
  isRocketSilo: function (property) {
    if (DEBUG) assert(property instanceof cwt.Property);

    if (!property.type.rocketsilo) return false;
    if (arguments.length === 2) {
      var fuidType = model.unit_data[uid].type.ID;

      if (property.type.rocketsilo.fireable.indexOf(fuidType) === -1) {
        return false;
      }
    }

    return true;
  },

  /**
   * Returns true if a property id is a rocket silo. A rocket silo
   * has the ability to fire a rocket to a position with an impact.
   */
  canBeFired: function (property,unit) {
    if (DEBUG) assert(unit instanceof cwt.Unit);

    if (this.type.rocketsilo.fireable.indexOf(unit.type.ID) === -1) return false;
    return true;
  },

  /**
   *
   * @param property
   * @param x
   * @param y
   * @return {boolean}
   */
  canBeFiredTo: function (property, x, y) {
    if (DEBUG) assert(property instanceof cwt.Property);

    if (!cwt.Map.isValidPosition(x, y)) return false;
  },

  /**
   * Fires a rocket to a given position (x,y) and inflicts damage to
   * all units in a range around the position.
   *
   * @param x
   * @param y
   * @param tx
   * @param ty
   * @param owner
   */
  fireSilo: function (x, y, tx, ty, owner) {
    var silo = cwt.Map.data[x][y].property;

    if (DEBUG) assert(property instanceof cwt.Property);

    var type = silo.type;
    var targetType = cwt.PropertySheet.sheets[type.changeTo];

    cwt.ClientEvents.propertyTypeChanged(silo,silo.type,targetType);
    silo.type = targetType;

    // var damage = cwt.Unit.pointsToHealth(type.rocketsilo.damage);
    // var range = type.rocketsilo.range;
    //model.events.rocketFly(x, y, tx, ty);
    //model.events.explode_invoked(tx, ty, range, damage, owner);
  }

};