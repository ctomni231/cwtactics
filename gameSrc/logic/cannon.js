/**
 *
 * @namespace
 */
cwt.Cannon = {

  /**
   * Returns `true` if a given property id is a cannon property.
   */
  isCannonUnit: function (unit) {
    assert(model.unit_isValidUnitId(uid));
    var unit = model.unit_data[uid];
    return (unit.type.ID === "CANNON_UNIT_INV");
  },

  /**
   * Marks all cannon targets in a selection. The area of fire will be defined by
   * the rectangle from  `sx,sy` to `tx,ty`. The cannon is on the tile `ox,oy`
   * with a given `range`.
   */
  tryToMarkCannonTargets: function (pid, selection, ox, oy, otx, oty, sx, sy, tx, ty, range) {
    assert(model.player_isValidPid(pid));

    var tid = model.player_data[pid].team;
    var osy = sy;
    var result = false;
    for (; sx <= tx; sx++) {
      for (sy = osy; sy >= ty; sy--) {
        if (!model.map_isValidPosition(sx, sy)) continue;

        // range maybe don't match
        if ((Math.abs(sx - ox) + Math.abs(sy - oy)) > range) continue;
        if ((Math.abs(sx - otx) + Math.abs(sy - oty)) > range) continue;

        // in fog
        if (model.fog_turnOwnerData[sx][sy] <= 0) continue;

        var unit = model.unit_posData[sx][sy];
        if (unit) {
          if (unit.owner !== pid && model.player_data[unit.owner].team !== tid) {
            selection.setValueAt(sx, sy, 1);
            result = true;
          }
        }
      }
    }

    return result;
  },

  /**
   * Marks all cannon targets in a given selection model.
   */
  markCannonTargets: function (uid, selection) {
    var result;
    var unit = model.unit_data[uid];
    var prop = model.property_posMap[unit.x][unit.y];
    var type = (prop.type.ID !== "PROP_INV") ? prop.type : model.bombs_grabPropTypeFromPos(unit.x, unit.y);

    // no cannon
    // if( !type.cannon ) return false;
    assert(type.cannon);

    selection.setCenter(unit.x, unit.y, INACTIVE_ID);

    var max = type.cannon.range;
    switch (type.cannon.direction) {

      case "N":
        result = model.bombs_tryToMarkCannonTargets(
          unit.owner,
          selection,
          unit.x, unit.y,
          unit.x, unit.y - max - 1,
          unit.x - unit + 1, unit.y - 1,
          unit.x + unit - 1, unit.y - max,
          max
        );
        break;

      case "E":
        result = model.bombs_tryToMarkCannonTargets(
          unit.owner,
          selection,
          unit.x, unit.y,
          unit.x + max + 1, unit.y,
          unit.x + 1, unit.y + max - 1,
          unit.x + max, unit.y - max + 1,
          max
        );
        break;

      case "W":
        result = model.bombs_tryToMarkCannonTargets(
          unit.owner,
          selection,
          unit.x, unit.y,
          unit.x - max - 1, unit.y,
          unit.x - max, unit.y + max - 1,
          unit.x - 1, unit.y - max + 1,
          max
        );
        break;

      case "S":
        result = model.bombs_tryToMarkCannonTargets(
          unit.owner,
          selection,
          unit.x, unit.y,
          unit.x, unit.y + max + 1,
          unit.x - max + 1, unit.y + max,
          unit.x + max - 1, unit.y + 1,
          max
        );
        break;
    }

    return result;
  },

  /**
   *
   */
  grabBombPropTypeFromPos: function (x, y) {
    while (true) {

      if (y + 1 < model.map_height && model.property_posMap[x][y + 1] &&
        model.property_posMap[x][y + 1].type.ID === "PROP_INV") {
        y++;
        continue;
      }

      break;
    }

    if (model.property_posMap[x][y].type.ID !== "PROP_INV") {
      return model.property_posMap[x][y].type;
    }

    while (true) {

      if (x + 1 < model.map_width && model.property_posMap[x + 1][y] &&
        model.property_posMap[x + 1][y].type.ID !== "PROP_INV") {
        return model.property_posMap[x + 1][y].type;
      }

      break;
    }

    assert(false);
  },

  fireCannon_check: function (uid, selection) {
    return (
      model.bombs_isCannon(uid) &&
        model.bombs_markCannonTargets(uid, selection)
      );
  },

  fireCannon_fillTargets: function (uid, selection) {
    model.bombs_markCannonTargets(uid, selection);
  },

  /**
   * Fires a cannon at a given position.
   */
  fireCannon_invoked: function (ox, oy, x, y) {
    var prop = model.property_posMap[x][y];
    var target = model.unit_posData[x][y];
    var type = model.bombs_grabPropTypeFromPos(ox, oy);
    model.events.damageUnit(
      model.unit_extractId(target),
      model.unit_convertPointsToHealth(type.cannon.damage),
      9
    );
  }
};