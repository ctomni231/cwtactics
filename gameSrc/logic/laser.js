//
// Returns **true** when the given **unit** is the mechanical laser trigger, else **false**.
//
exports.isLaser = function (unit) {
  if (this.DEBUG) cwt.assert(unit instanceof cwt.UnitClass);

  return (unit.type.ID === cwt.DataSheets.LASER_UNIT_INV);
};

//
// Fires a laser at a given position (**x**,**y**).
//
exports.fireLaser = function (x, y) {
  var map = cwt.Model.mapData;
  var prop = map[x][y].property;

  if (cwt.DEBUG) cwt.assert(prop && prop.type.laser);

  var ox = x;
  var oy = y;
  var savedTeam = prop.owner.team;
  var damage = cwt.UnitClass.pointsToHealth(prop.type.laser.damage);

  // every tile on the cross ( same y or x coordinate ) will be damaged
  for (var x = 0, xe = cwt.Model.mapWidth; x < xe; x++) {
    var doIt = false;

    if (x === ox) {
      for (var y = 0, ye = cwt.Model.mapHeight; y < ye; y++) {
        if (oy !== y) {
          var unit = map[x][y].unit;
          if (unit && unit.owner.team !== savedTeam) {
            unit.takeDamage(damage, 9);
          }
        }
      }
    } else {
      var unit = map[x][y].unit;
      if (unit && unit.owner.team !== savedTeam) {
        unit.takeDamage(damage, 9);
      }
    }
  }
};