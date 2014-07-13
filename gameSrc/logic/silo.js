//
// Logic for the rocket silo mechanic.
//
cwt.Silo = {

  //
  // Returns true if a property id is a rocket silo. A rocket silo has the ability to fire a rocket to a
  // position with an impact.
  //
  isRocketSilo: function(property) {
    if (cwt.DEBUG) cwt.assert(property instanceof cwt.PropertyClass);

    return (property.type.rocketsilo != undefined);
  },

  //
  // Returns **true** when a silo **property** can be triggered by a given **unit**. If not, **false** will be returned.
  //
  canBeFiredBy: function(property, unit) {
    if (cwt.DEBUG) {
      cwt.assert(unit instanceof cwt.UnitClass);
      cwt.assert(this.isRocketSilo(property));
    }

    return (property.type.rocketsilo.fireable.indexOf(unit.type.ID) > -1);
  },

  //
  // Returns **true** if a given silo **property** can be fired to a given position (**x**,**y**). If not, **false**
  // will be returned.
  //
  canBeFiredTo: function(property, x, y) {
    if (cwt.DEBUG) {
      cwt.assert(this.isRocketSilo(property));
    }

    return (cwt.Model.isValidPosition(x, y));
  },

  //
  // Fires a rocket from a given rocket silo at position (**x**,**y**) to a given target
  // position (**tx**,**ty**) and inflicts damage to all units in the range of the explosion. The health of the units
  // will be never lower as 9 health after the explosion.
  //
  fireSilo: (function () {

    // inline function
    function doDamage(x, y, tile, damage) {
      var unit = tile.unit;
      if (unit) {
        unit.takeDamage(damage, 9);
      }
    }

    return function(x, y, tx, ty) {
      var silo = cwt.Model.mapData[x][y].property;

      if (this.DEBUG) cwt.assert(this.isRocketSilo(silo));

      // change silo type to empty
      var type = silo.type;
      silo.type = cwt.DataSheets.properties.sheets[type.changeTo];

      var damage = cwt.UnitClass.pointsToHealth(type.rocketsilo.damage);
      var range = type.rocketsilo.range;

      cwt.Model.doInRange(tx, ty, range, doDamage, damage);
    };
  })()

};
