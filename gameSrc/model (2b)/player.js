/**
 * @class
 */
cwt.Player = my.Class({

  STATIC: {

    /**
     * Power level of normal CO power.
     */
    POWER_LEVEL_COP: 0,

    /**
     * Power level of normal super CO power.
     */
    POWER_LEVEL_SCOP: 1,

    RELATION_SAMETHING:-1,
    RELATION_NONE:0,
    RELATION_OWN:1,
    RELATION_ALLIED:2,
    RELATION_TEAM:3,
    RELATION_ENEMY:4,
    RELATION_NULL:5,

    /**
     * Different available money transfer steps.
     */
    MONEY_TRANSFER_STEPS: [
      1000,
      2500,
      5000,
      10000,
      25000,
      50000
    ]
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
   * Decline activate power action on game modes that aren't AW1-3.
   * Decline activate power action when a player cannot activate the base cop level.
   * Returns `true`when a given player can activate a power level.
   */
  canActivatePower: function () {
    if (controller.configValue("co_enabledCoPower") === 0) return false;

    if (model.co_activeMode !== cwt.Player.GAME_MODES.AW1 &&
      model.co_activeMode !== cwt.Player.GAME_MODES.AW2 &&
      model.co_activeMode !== cwt.Player.GAME_MODES.AWDS) return false;

    if (!model.co_canActivatePower(pid, cwt.Player.CO_POWER_LEVEL.COP)) return false;

    assert(model.player_isValidPid(pid));

    assert(util.intRange(powerType, model.co_POWER_LEVEL.INACTIVE, model.co_POWER_LEVEL.TSCOP));

    var co_data = model.co_data[model.round_turnOwner];

    // co must be available and current power must be inactive
    if (co_data.coA === null) return false;
    if (co_data.level !== model.co_POWER_LEVEL.INACTIVE) return false;

    var stars;
    switch (powerType) {

      case model.co_POWER_LEVEL.COP:
        stars = co_data.coA.coStars;
        break;

      case model.co_POWER_LEVEL.SCOP:
        stars = co_data.coA.scoStars;
        break;

      // TODO
    }
    ;

    return (co_data.power >= model.co_getStarCost(model.round_turnOwner) * stars);
  },

  /**
   *
   */
  activatePower: function (level) {
    this.power = 0;
    this.activePower = 0;
    this.powerUsed++;
  },

  // Sets the main CO of a player.
  //
  setMainCo: function (type) {
    if (type === null) {
      if (isMain) model.co_data[pid].coA = null;
      else model.co_data[pid].coB = null;
    } else {
      assert(model.data_coSheets.hasOwnProperty(type));
      if (isMain) model.co_data[pid].coA = model.data_coSheets[type];
      else model.co_data[pid].coB = model.data_coSheets[type];
    }
  },

  /**
   * Modifies the power level of a player.
   */
  modifyPower: function (value) {
    assert(model.player_isValidPid(pid));

    var data = model.co_data[pid];

    data.power += value;
    if (data.power < 0) data.power = 0;
  },

  /**
   * Returns the cost for one CO star for a given player.
   */
  getStarCost: function () {
    assert(model.player_isValidPid(pid));

    var cost = controller.configValue("co_getStarCost");
    var used = model.co_data[pid].timesUsed;

    // if usage counter is greater than max usage counter then use
    // only the maximum increase counter for calculation
    var maxUsed = controller.configValue("co_getStarCostIncreaseSteps");
    if (used > maxUsed) used = maxUsed;

    cost += used * controller.configValue("co_getStarCostIncrease");

    return cost;
  },

  /**
   * Returns `true` when a player can transfer money to a tile owner.
   */
  canTransferMoney: function(x, y) {
    var ref;

    if (model.player_data[pid].gold < model.team_MONEY_TRANSFER_STEPS[0]) {
      return false;
    }

    if (model.fog_turnOwnerData[x][y] === 0) return false;

    // check unit first
    ref = model.unit_posData[x][y];
    if (ref === null || ref.owner === pid) {

      // check property
      ref = model.property_posMap[x][y];
      if (ref !== null && ref.owner !== pid && ref.owner !== -1) {
        return;
      }

      return false;
    }
  },

  /**
   * Returns `true` when a player can transfer money
   * to a tile owner.
   */
  getTransferMoneyTargets: function(menu) {
    for (var i = 0, e = cwt.Player.MONEY_TRANSFER_STEPS.length; i < e; i++) {
      if (this.gold >= cwt.Player.MONEY_TRANSFER_STEPS[i]) {
        menu.addEntry(cwt.Player.MONEY_TRANSFER_STEPS[i]);
      }
    }
  },

  /**
   * Transfers money from one player to another player.
   */
  transferMoney: function( player, money) {
    this.gold -= money;
    player.gold += money;

    // the amount of gold cannot be lower 0 after the transfer
    assert(this.gold >= 0);

    cwt.ClientEvents.goldChange(this,money);
    cwt.ClientEvents.goldChange(player,money);
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
    // if model (2b).player_playerGivesUp was called from network context
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