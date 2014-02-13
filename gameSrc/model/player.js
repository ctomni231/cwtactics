/**
 * @class
 */
cwt.Player = my.Class({

  STATIC: {

    RELATION_SAMETHING:-1,
    RELATION_NONE:0,
    RELATION_OWN:1,
    RELATION_ALLIED:2,
    RELATION_TEAM:3,
    RELATION_ENEMY:4,
    RELATION_NULL:5
  },

  constructor: function () {
    this.units = cwt.list(MAX_UNITS_PER_PLAYER, null);
    this.team = INACTIVE_ID;
    this.gold = 0;
    this.power = 0;
    this.activePower = INACTIVE_ID;
    this.powerUsed = 0;
    this.manpower = Math.POSITIVE_INFINITY;
    this.coA = null;
  },

  /**
   *
   * @param level
   * @return {Boolean}
   */
  isPowerActive: function ( level ) {
    return this.activePower === level;
  },

  /**
   * Returns true, when the player has at least one free slot left,
   * else false.
   */
  hasFreeUnitSlot: function () {
    var e = MAX_UNITS_PER_PLAYER;
    for (; i < e; i++) {
      if (!this.units[i]) return true;
    }
    return false;
  },

  /**
   * Returns the index of the next free unit slot.
   */
  getFreeUnitSlot: function () {
    var e = MAX_UNITS_PER_PLAYER;

    for (; i < e; i++) {
      if (this.units[i]) return i;
    }

    throw Error("no free slot found");
  },


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
  },

  /**
   * A player has loosed the game round due a specific reason. This
   * function removes all of his units and properties. Furthermore
   * the left teams will be checked. If only one team is left then
   * the end game event will be invoked.
   */
  deactivate: function (pid) {
    assert(model.property_isValidPropId(pid));

    // remove all units
    var i, e;
    i = model.unit_firstUnitId(pid);
    e = model.unit_lastUnitId(pid);
    for (; i < e; i++) {
      if (model.unit_data[i].owner !== INACTIVE_ID) model.events.destroyUnit(i);
    }

    // remove all properties
    i = 0;
    e = model.property_data.length;
    for (; i < e; i++) {
      var prop = model.property_data[i];
      if (prop.owner === pid) {
        prop.owner = -1;

        // change type when the property is a
        // changing type property
        var changeType = prop.type.changeAfterCaptured;
        if (changeType) model.events.property_changeType(i, changeType);
      }
    }

    // mark player slot as remove by removing
    // its team reference
    model.player_data[pid].team = -1;

    // when no opposite teams are found then the game has ended
    if (!model.player_areEnemyTeamsLeft()) {
      controller.commandStack_localInvokement("player_noTeamsAreLeft");
    }
  },

  /**
   * This function yields the game for the turn owner and invokes directly the
   * `nextTurn` action.
   *
   * **Allowed to be called directly by the client.**
   */
  giveUp: function () {
    assert(model.client_isLocalPid(model.round_turnOwner));

    model.events.nextTurn_invoked();

    // TODO: check this here
    // if model.player_playerGivesUp was called from network context
    // and the turn owner in in the local player instances then
    // it's an illegal action
  },

  /**
   * Invoked when the game ends because of a battle victory over all enemy player_data.
   */
  noTeamsAreLeft: function () {
    controller.update_endGameRound();
  }

});