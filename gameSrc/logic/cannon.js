/**
 *
 * @namespace
 */
cwt.Cannon = {

  /**
   * Returns `true` if a given property id is a cannon property.
   */
  isCannonUnit: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    return (unit.type.ID === "CANNON_UNIT_INV");
  },

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {cwt.SelectionMap} selection
   * @return {boolean}
   */
  hasTargets: function (x, y, selection) {
    return this.isCannonUnit(cwt.Map.data[x][y].unit) && this.markCannonTargets(x, y, selection);
  },

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {cwt.SelectionMap} selection
   */
  fillCannonTargets: function (x, y, selection) {
    this.markCannonTargets(x, y, selection);
  },

  /**
   * Fires a cannon at a given position.
   */
  fireCannon: function (ox, oy, x, y) {
    var target = cwt.Map.data[x][y].unit;
    var type = this.grabBombPropTypeFromPos(ox, oy);

    target.takeDamage(cwt.Unit.pointsToHealth(type.cannon.damage), 9);
  },

  /**
   * Marks all cannon targets in a selection. The area of fire will be defined by
   * the rectangle from  `sx,sy` to `tx,ty`. The cannon is on the tile `ox,oy`
   * with a given `range`.
   */
  tryToMarkCannonTargets: function (player, selection, ox, oy, otx, oty, sx, sy, tx, ty, range) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.Player);

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
            if(selection) selection.setValueAt(sx, sy, 1);
            else return true;
            result = true;
          }
        }
      }
    }

    return result;
  },

  /**
   * Marks all cannon targets in a given selection model.
   *
   * @param {cwt.Unit} cannon
   * @param {cwt.SelectionMap} selection
   */
  markCannonTargets: function (x, y, selection) {
    var prop = cwt.Map.data[x][y].property;
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
        oty = y-max-1;
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
        otx = x - max -1;
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
      cwt.Map.data[x][y].unit.owner,
      selection,
      ox,oy,
      otx,oty,
      sx,sy,
      tx,ty,
      max
    );
  },

  /**
   *
   * @param x
   * @param y
   * @return {cwt.PropertySheet}
   */
  grabBombPropTypeFromPos: function (x, y) {
    var map = cwt.Map.data;
    while (true) {
      if (y + 1 < cwt.Map.height && map[x][y + 1].property &&
        map[x][y + 1].property.type.ID === "PROP_INV") {
        y++;
        continue;
      }

      break;
    }

    if (map[x][y].property.type.ID !== "PROP_INV") {
      return map[x][y].property.type;
    }

    while (true) {
      if (x + 1 < cwt.Map.width && map[x + 1][y].property &&
        map[x + 1][y].property.type.ID !== "PROP_INV") {
        return map[x + 1][y].property.type;
      }

      break;
    }

    cwt.assert(false);
  }
};