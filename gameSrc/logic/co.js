my.extendClass(cwt.Player, {

  STATIC: {

    /**
     * Contains all co modes, that are available in `Custom Wars: Tactics`.
     */
    GAME_MODES: {
      AW1: 1,
      AW2: 2//,
      //AWDS: 3,
      //AWDR: 4
    },

    /**
     * Contains all co power levels.
     */
    CO_POWER_LEVEL: {
      INACTIVE: 0,
      COP: 1,
      SCOP: 2//,
      //TSCOP: 3
    }
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
    };

    return (co_data.power >= model.co_getStarCost(model.round_turnOwner) * stars);
  },

  /**
   *
   */
  activatePower: function (level) {
    var data = model.co_data[pid];
    data.power = 0;
    data.level = level;
    data.timesUsed++;
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
  getStarCost: function (pid) {
    assert(model.player_isValidPid(pid));

    var cost = controller.configValue("co_getStarCost");
    var used = model.co_data[pid].timesUsed;

    // if usage counter is greater than max usage counter then use
    // only the maximum increase counter for calculation
    var maxUsed = controller.configValue("co_getStarCostIncreaseSteps");
    if (used > maxUsed) used = maxUsed;

    cost += used * controller.configValue("co_getStarCostIncrease");

    return cost;
  }
  
  /**
   * Returns the range of a commander.
  getCommanderRange: function (pid) {
    assert(util.intRange(pid, 0, MAX_PLAYER - 1));
    assert(model.co_activeMode === model.co_MODES.AWDR);

    if (model.co_data[pid].detachedTo === INACTIVE_ID) return -1;

    return -1; // TODO
  },
   */

  /**
   * Returns `true` when an unit is in the range of a commander, else `false`.
  isInCommanderFocus: function (uid, pid) {

    // are we playing Commander mode ?
    if (model.co_activeMode !== model.co_MODES.AWDR) return false;

    // is commander active ?
    if (model.co_data[pid].detachedTo === INACTIVE_ID) return false;

    var com = model.units[model.co_data[pid].detachedTo];
    var cx = com.x;
    var cy = com.y;
    var cr = model.co_commanderRange(pid);
    var unit = model.units[uid];
    var x = unit.x;
    var y = unit.y;

    // check distance to commander
    var disX = Math.abs(x - cx);
    if (disX > cr) return false;

    var disY = Math.abs(y - cy);
    if (disX + disY > cr) return false;

    // in range of the commander
    return true;
  },
   */

});