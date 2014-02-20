/**
 *
 * @namespace
 */
cwt.Laser = my.extendClass(cwt.Unit, {

  /**
   * Returns true when the unit is a laser unit, else false.
   */
  isLaser: function (unit) {
    if (DEBUG) assert(unit instanceof cwt.Unit);

    return (unit.type.ID === "LASER_UNIT_INV");
  },

  /**
   * Fires a laser at a given position.
   */
  fireLaser: function (x, y) {
    var map = cwt.Map.data;

    var prop = map[x][y].property;
    if (DEBUG) assert(prop);

    var ox = x;
    var oy = y;
    var owner = prop.owner;

    // check all tiles on the map
    for (var x = 0, xe = cwt.Map.width; x < xe; x++) {
      for (var y = 0, ye = cwt.Map.height; y < ye; y++) {

        // every tile on the cross ( same y or x coordinate ) will be damaged
        if (ox === x || oy === y) {

          var unit = map[x][y].unit;
          if (unit && unit.owner !== owner) {
            unit.takeDamage(cwt.Unit.pointsToHealth(prop.type.laser.damage),9);
          }
        }
      }
    }
  }

});