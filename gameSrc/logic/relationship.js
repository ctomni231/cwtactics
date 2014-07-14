//
//
// @namespace
//
cwt.Relationship = {

  //
  // @constant
  //
  RELATION_SAME_THING: -1,

  //
  // @constant
  //
  RELATION_NONE: 0,

  //
  // @constant
  //
  RELATION_OWN: 1,

  //
  // @constant
  //
  RELATION_ALLIED: 2,

  //
  // @constant
  //
  RELATION_TEAM: 3,

  //
  // @constant
  //
  RELATION_ENEMY: 4,

  //
  // @constant
  //
  RELATION_NULL: 5,

  CHECK_NORMAL: 0,

  CHECK_UNIT: 1,

  CHECK_PROPERTY: 2,

  //
  //
  // @param {cwt.Position} left
  // @param {cwt.Position} right
  // @param {number?} checkLeft
  // @param {number?} checkRight
  // @return {number}
  //
  getRelationShipTo: function(left, right, checkLeft, checkRight) {
    var oL;
    var oR;

    if (checkLeft !== this.CHECK_PROPERTY) oL = left.unit;
    if (checkRight !== this.CHECK_PROPERTY) oR = right.unit;

    if (!oL && checkLeft !== this.CHECK_UNIT) oL = left.property;
    if (!oR && checkRight !== this.CHECK_UNIT) oR = right.property;

    if (!oL) {
      return this.RELATION_NULL;
    }

    return this.getRelationship(oL, oR);
  },

  //
  // Returns true if there is an unit with a given relationship on a tile
  // at a given position (x,y).
  //
  // @param {*} objectA
  // @param {*} objectB
  // @return {number}
  //
  getRelationship: function(objectA, objectB) {

    // one object is null
    if (objectA === null || objectB === null) {
      return this.RELATION_NONE;
    }

    var playerA = // @type {cwt.Player} */ (objectA instanceof cwt.Player) ? objectA : objectA.owner;
    var playerB = // @type {cwt.Player} */ (objectB instanceof cwt.Player) ? objectB : objectB.owner;

    // one player is inactive
    if (playerA.team === -1 || playerB.team === -1) {
      return this.RELATION_NONE;
    }

    // own
    if (playerA === playerB) {
      return this.RELATION_SAME_THING;
    }

    // allied or enemy ?
    if (playerA.team === playerB.team) {
      return this.RELATION_ALLIED;
    } else {
      return this.RELATION_ENEMY;
    }
  },

  //
  // Returns true if there is an unit with a given relationship in
  // one of the neighbour tiles at a given position (x,y).
  //
  // @example
  //       x
  //     x o x
  //       x
  //
  getRelationshipUnitNeighbours: function(player, x, y, mode) {
    if (this.DEBUG) cwt.assert(cwt.Map.isValidPosition(x, y));

    var unit;

    // WEST
    if (x > 0) {
      unit = cwt.Map.data[x - 1][y].unit;
      if (unit && this.getRelationship(player, unit.owner) === mode) return true;
    }

    // NORTH
    if (y > 0) {
      unit = cwt.Map.data[x][y - 1].unit;
      if (unit && this.getRelationship(player, unit.owner) === mode) return true;
    }

    // EAST
    if (x < cwt.Map.width - 1) {
      unit = cwt.Map.data[x + 1][y].unit;
      if (unit && this.getRelationship(player, unit.owner) === mode) return true;
    }

    // SOUTH
    if (y < cwt.Map.height - 1) {
      unit = cwt.Map.data[x][y + 1].unit;
      if (unit && this.getRelationship(player, unit.owner) === mode) return true;
    }

    return false;
  }

};
