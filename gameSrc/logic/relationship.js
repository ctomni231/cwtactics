/**
 *
 * @namespace
 */
cwt.Relationship = {

  RELATION_SAMETHING: -1,
  RELATION_NONE: 0,
  RELATION_OWN: 1,
  RELATION_ALLIED: 2,
  RELATION_TEAM: 3,
  RELATION_ENEMY: 4,
  RELATION_NULL: 5,

  /**
   * Returns true if there is an unit with a given relationship on a tile
   * at a given position (x,y).
   */
  getRelationship: function (objectA, objectB) {

    // one object is null
    if (objectA === null || objectB === null) return this.RELATION_NONE;

    var playerA = /** @type {cwt.Player} */ (objectA instanceof cwt.Player) ? objectA : objectA.owner;
    var playerB = /** @type {cwt.Player} */ (objectB instanceof cwt.Player) ? objectB : objectB.owner;

    // one player is inactive
    if (playerA.team === -1 || playerB.team === -1) return this.RELATION_NONE;

    // own
    if (playerA === playerA) return this.RELATION_SAMETHING;

    var teamA = playerA.team;
    var teamB = playerB.team;

    // allied
    if (teamA === teamB) return this.RELATION_ALLIED;

    // enemy
    if (teamA !== teamB) return this.RELATION_ENEMY;

    return this.RELATION_NONE;
  },

  /**
   * Returns true if there is an unit with a given relationship in
   * one of the neighbour tiles at a given position (x,y).
   *
   * @example
   *       x
   *     x o x
   *       x
   */
  getRelationshipUnitNeighbours: function (player, x, y, mode) {
    if (this.DEBUG) assert(cwt.Map.isValidPosition(x,y));

    var unit;

    // WEST
    if( x > 0 ){
      unit = cwt.Map.data[x-1][y].unit;
      if (unit && this.getRelationship(player,unit.owner) === mode) return true;
    }

    // NORTH
    if( y > 0 ){
      unit = cwt.Map.data[x][y-1].unit;
      if (unit && this.getRelationship(player,unit.owner) === mode) return true;
    }

    // EAST
    if( x < cwt.Map.width-1 ){
      unit = cwt.Map.data[x+1][y].unit;
      if (unit && this.getRelationship(player,unit.owner) === mode) return true;
    }

    // SOUTH
    if( y < cwt.Map.height-1 ){
      unit = cwt.Map.data[x][y+1].unit;
      if (unit && this.getRelationship(player,unit.owner) === mode) return true;
    }

    return false;
  }

};