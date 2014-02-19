cwt.Relationship = {



  /**
   * Returns true if there is an unit with a given relationship on a tile
   * at a given position (x,y).
   */
  getRelationship: function (otherObject) {

    // none
    if (pidA === null || pidB === null) return model.player_RELATION_MODES.NULL;
    if (pidA === -1 || pidB === -1) return model.player_RELATION_MODES.NONE;
    if (model.player_data[pidA].team === -1 ||
      model.player_data[pidB].team === -1) return model.player_RELATION_MODES.NONE;

    // own
    if (pidA === pidB) return model.player_RELATION_MODES.OWN;

    var teamA = model.player_data[pidA].team;
    var teamB = model.player_data[pidB].team;
    if (teamA === -1 || teamB === -1) return model.player_RELATION_MODES.NONE;

    // allied
    if (teamA === teamB) return model.player_RELATION_MODES.ALLIED;

    // enemy
    if (teamA !== teamB) return model.player_RELATION_MODES.ENEMY;

    return model.player_RELATION_MODES.NONE;
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
  getRelationshipUnitNeighbours: function (pid, x, y, mode) {
    assert(model.property_isValidPropId(pid));
    assert(model.map_isValidPosition(x, y));

    var check = model.player_getRelationship;

    var ownCheck = (mode === model.player_RELATION_MODES.OWN);
    var i = 0;
    var e = model.unit_data.length;

    // enhance lookup when only
    // own units are checked
    if (ownCheck) {
      i = model.unit_firstUnitId(pid);
      e = model.unit_lastUnitId(pid);
    }

    // check all
    for (; i < e; i++) {

      // true when neighbor is given and mode is correct
      if (model.unit_getDistance(sid, i) === 1) {
        if (ownCheck || check(pid, model.unit_data[i].owner) === mode) return true;
      }
    }

    return false;
  }

};