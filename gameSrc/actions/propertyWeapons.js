"use strict";

var constants = require("../constants");
var assert = require("../system/functions").assert;
var sheets = require("../sheets");
var model = require("../model");

// Returns **true** when the given **unit** is the mechanical laser trigger, else **false**.
//
exports.isLaser = function (unit) {
  if (constants.DEBUG) assert(unit instanceof model.Unit);
  return (unit.type.ID === sheets.LASER_UNIT_INV);
};

// Fires a laser at a given position (**x**,**y**).
//
exports.fireLaser = function (x, y) {
  var map = model.mapData;
  var prop = map[x][y].property;

  if (constants.DEBUG) assert(prop && prop.type.laser);

  var ox = x;
  var oy = y;
  var savedTeam = prop.owner.team;
  var damage = model.Unit.pointsToHealth(prop.type.laser.damage);

  // every tile on the cross ( same y or x coordinate ) will be damaged
  for (var x = 0, xe = model.mapWidth; x < xe; x++) {
    var doIt = false;

    if (x === ox) {
      for (var y = 0, ye = model.mapHeight; y < ye; y++) {
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

//
// Returns true if a property id is a rocket silo. A rocket silo has the ability to fire a rocket to a
// position with an impact.
//
exports.isRocketSilo = function (property) {
  if (constants.DEBUG) assert(property instanceof model.Property);
  return (property.type.rocketsilo != undefined);
};

//
// Returns **true** when a silo **property** can be triggered by a given **unit**. If not, **false** will be returned.
//
exports.canBeFiredBy = function (property, unit) {
  if (constants.DEBUG) {
    assert(unit instanceof model.Unit);
    assert(exports.isRocketSilo(property));
  }

  return (property.type.rocketsilo.fireable.indexOf(unit.type.ID) > -1);
};

//
// Returns **true** if a given silo **property** can be fired to a given position (**x**,**y**). If not, **false**
// will be returned.
//
exports.canBeFiredTo = function (property, x, y) {
  if (constants.DEBUG) assert(exports.isRocketSilo(property));
  return (model.isValidPosition(x, y));
};

// inline function
var doDamage = function (x, y, tile, damage) {
  var unit = tile.unit;
  if (unit) {
    unit.takeDamage(damage, 9);
  }
};

//
// Fires a rocket from a given rocket silo at position (**x**,**y**) to a given target
// position (**tx**,**ty**) and inflicts damage to all units in the range of the explosion. The health of the units
// will be never lower as 9 health after the explosion.
//
exports.fireSilo = function (x, y, tx, ty) {
  var silo = model.mapData[x][y].property;

  if (this.DEBUG) assert(this.isRocketSilo(silo));

  // change silo type to empty
  var type = silo.type;
  silo.type = sheets.properties.sheets[type.changeTo];

  var damage = model.Unit.pointsToHealth(type.rocketsilo.damage);
  var range = type.rocketsilo.range;

  model.doInRange(tx, ty, range, doDamage, damage);
};

require('../actions').unitAction({
  key: "silofire",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_SAME_THING,
    cwt.Relationship.RELATION_NONE
  ],

  relationToProp: [
    "S", "T",
    cwt.Player.RELATION_NONE
  ],

  condition: function (data) {
    if (!cwt.Silo.isRocketSilo(data.target.property)) return false;
    if (!cwt.Silo.canBeFired(data.target.property, data.source.unit)) return false;
    return true;
  },

  prepareSelection: function (data) {
    data.selectionRange = data.target.property.type.rocketsilo.range;
  },

  isTargetValid: function (data, x, y) {
    return cwt.Silo.canBeFiredTo(data.target.property, x, y);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.x;
    dataBlock.p2 = data.source.y;
    dataBlock.p3 = data.targetselection.x;
    dataBlock.p4 = data.targetselection.y;
    dataBlock.p5 = data.source.unit.owner.id;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Silo.fireSilo(
      dataBlock.p1,dataBlock.p2,
      dataBlock.p3,dataBlock.p4,
      cwt.Player.getInstance(dataBlock.p5)
    );
  }
});

//
// Returns **true** if a given **unit** is a cannon trigger unit, else **false**.
//
exports.isCannonUnit = function (unit) {
  if (cwt.DEBUG) {
    cwt.assert(unit instanceof cwt.UnitClass);
  }

  return (unit.type.ID === cwt.DataSheets.CANNON_UNIT_INV);
};

//
// Returns **true** when a cannon trigger unit is at a given position (**x**,**y**) and has targets in it's range,
// else **false**.
//
exports.hasTargets = function (x, y, selection) {
  return (this.isCannonUnit(cwt.Model.mapData[x][y].unit) && this.markCannonTargets(x, y, selection));
};

//
//
// @param {number} x
// @param {number} y
// @param {cwt.SelectionMap} selection
//
exports.fillCannonTargets = function (x, y, selection) {
  this.markCannonTargets(x, y, selection);
};

//
// Fires a cannon at a given position.
//
exports.fireCannon = function (ox, oy, x, y) {
  var target = cwt.Model.mapData[x][y].unit;
  var type = this.grabBombPropTypeFromPos(ox, oy);

  target.takeDamage(cwt.Unit.pointsToHealth(type.cannon.damage), 9);
};

//
// Marks all cannon targets in a selection. The area of fire will be defined by
// the rectangle from  `sx,sy` to `tx,ty`. The cannon is on the tile `ox,oy`
// with a given `range`.
//
exports.tryToMarkCannonTargets = function (player, selection, ox, oy, otx, oty, sx, sy, tx, ty, range) {
  if (this.DEBUG) cwt.assert(player instanceof cwt.PlayerClass);

  var tid = player.team;
  var osy = sy;
  var result = false;
  for (; sx <= tx; sx++) {
    for (sy = osy; sy >= ty; sy--) {
      if (!cwt.Map.isValidPosition(sx, sy)) continue;
      var tile = cwt.Map.data[sx][sy];

      // range maybe don't match
      if ((Math.abs(sx - ox) + Math.abs(sy - oy)) > range) continue;
      if ((Math.abs(sx - otx) + Math.abs(sy - oty)) > range) continue;

      // in fog
      if (tile.visionTurnOwner <= 0) continue;

      var unit = tile.unit;
      if (unit) {
        if (unit.owner.team !== tid) {
          if (selection) selection.setValueAt(sx, sy, 1);
          else return true;
          result = true;
        }
      }
    }
  }

  return result;
};

//
// Marks all cannon targets in a given selection model.
//
// @param {cwt.Unit} cannon
// @param {cwt.SelectionMap} selection
//
exports.markCannonTargets = function (x, y, selection) {
  var prop = cwt.Model.mapData[x][y].property;
  var type = (prop.type.ID !== "PROP_INV") ? prop.type : this.grabBombPropTypeFromPos(x, y);

  if (this.DEBUG) cwt.assert(type.cannon);

  selection.setCenter(x, y, cwt.INACTIVE);

  var otx, oty, sx, sy, tx, ty;
  var max = type.cannon.range;
  var ox = x;
  var oy = y;
  switch (type.cannon.direction) {

    case "N":
      otx = x;
      oty = y - max - 1;
      sx = x - max + 1;
      sy = y - 1;
      tx = x + max - 1;
      ty = y - max;
      break;

    case "E":
      otx = x + max + 1;
      oty = y;
      sx = x + 1;
      sy = y + max - 1;
      tx = x + max;
      ty = y - max + 1;
      break;

    case "W":
      otx = x - max - 1;
      oty = y;
      sx = x - max;
      sy = y + max - 1;
      tx = x - 1;
      ty = y - max + 1;
      break;

    case "S":
      otx = x;
      oty = y + max + 1;
      sx = x - max + 1;
      sy = y + max;
      tx = x + max - 1;
      ty = y + 1;
      break;
  }

  return this.tryToMarkCannonTargets(
    cwt.Model.mapData[x][y].unit.owner,
    selection,
    ox, oy,
    otx, oty,
    sx, sy,
    tx, ty,
    max
  );
};

//
//
// @param x
// @param y
// @return {cwt.PropertySheet}
//
exports.grabBombPropTypeFromPos = function (x, y) {
  var map = cwt.Model.mapData;
  while (true) {
    if (y + 1 < cwt.Model.mapHeight && map[x][y + 1].property &&
      map[x][y + 1].property.type.ID === cwt.DataSheets.PROP_INV) {
      y++;
      continue;
    }

    break;
  }

  if (map[x][y].property.type.ID !== cwt.DataSheets.PROP_INV) {
    return map[x][y].property.type;
  }

  while (true) {
    if (x + 1 < cwt.Model.mapWidth && map[x + 1][y].property &&
      map[x + 1][y].property.type.ID !== cwt.DataSheets.PROP_INV) {
      return map[x + 1][y].property.type;
    }

    break;
  }

  cwt.assert(false);
};

require('../actions').unitAction({
  key: "fireCannon",

  relation: [
    "S", "T",
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function (data) {
    return (
      cwt.Cannon.isCannonUnit(data.source.unit) &&
        cwt.Cannon.hasTargets(data.source.x, data.source.y, null)
      );
  },

  targetSelectionType: "A",
  prepareTargets: function (data) {
    cwt.Cannon.fillCannonTargets(data.source.x, data.source.y, data.selection);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.x;
    dataBlock.p2 = data.source.y;
    dataBlock.p3 = data.targetselection.x;
    dataBlock.p4 = data.targetselection.y;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Cannon.fireCannon(dataBlock.p1, dataBlock.p2,dataBlock.p3, dataBlock.p4);
  }

});

require('../actions').unitAction({
  key:"fireLaser",

  relation:[
    "S","T",
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data ){
    return cwt.Laser.isLaser(data.target.unit);
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.target.x;
    dataBlock.p2 = data.target.y;
  },

  parseDataBlock: function (dataBlock) {
    cwt.Laser.fireLaser(dataBlock.p1,dataBlock.p2);
  }
});
