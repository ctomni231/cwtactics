cwt.Config.create("co_getStarCost",5,50000,9000,5);
cwt.Config.create("co_getStarCostIncrease",0,50000,1800,5);
cwt.Config.create("co_getStarCostIncreaseSteps",0,50,10);
cwt.Config.create("co_enabledCoPower",0,1,1);

/**
 *
 * @namespace
 */
cwt.CO = {

  /**
   * Power level of normal CO power.
   */
  POWER_LEVEL_COP: 0,

  /**
   * Power level of normal super CO power.
   */
  POWER_LEVEL_SCOP: 1,

  /**
   * Decline activate power action on game modes that aren't AW1-3.
   * Decline activate power action when a player cannot activate the base cop level.
   * Returns `true`when a given player can activate a power level.
   */
  canActivatePower: function (player,powerType) {
    if (controller.configValue("co_enabledCoPower") === 0) return false;

    if (cwt.Gameround.gamemode !== cwt.Gameround.GAME_MODE_AW1 &&
      cwt.Gameround.gamemode !== cwt.Gameround.GAME_MODE_AW2) return false;

    if (DEBUG) assert(player instanceof cwt.Player);
    if (DEBUG) assert(powerType >= INACTIVE_ID && powerType <= this.POWER_LEVEL_SCOP);

    // co must be available and current power must be inactive
    if (player.coA === null || player.activePower !== INACTIVE_ID) return false;

    var stars;
    switch (powerType) {

      case this.POWER_LEVEL_COP:
        stars = player.coA.coStars;
        break;

      case this.POWER_LEVEL_SCOP:
        stars = player.coA.scoStars;
        break;

      // TODO
    }

    return (player.power >= (this.getStarCost(model.turnOwner) * stars));
  },

  /**
   *
   */
  activatePower: function (player, level) {
    if (DEBUG) assert(player instanceof cwt.Player);

    player.power = 0;
    player.activePower = 0;
    player.powerUsed++;
  },

  // Sets the main CO of a player.
  //
  setMainCo: function (player, type) {
    if (DEBUG) assert(player instanceof cwt.Player);

    if (type === null) {
      player.coA = null;
    } else {
      if (DEBUG) assert(cwt.CoSheet.isValidSheet(type));

      player.coA = type;
    }
  },

  /**
   * Modifies the power level of a player.
   */
  modifyPower: function (player, value) {
    if (DEBUG) assert(player instanceof cwt.Player);

    player.power += value;
    if (player.power < 0) player.power = 0;
  },

  /**
   * Returns the cost for one CO star for a given player.
   */
  getStarCost: function (player) {
    if (DEBUG) assert(player instanceof cwt.Player);

    var cost = controller.configValue("co_getStarCost");
    var used = player.timesUsed;

    // if usage counter is greater than max usage counter then use
    // only the maximum increase counter for calculation
    var maxUsed = controller.configValue("co_getStarCostIncreaseSteps");
    if (used > maxUsed) used = maxUsed;

    cost += used * controller.configValue("co_getStarCostIncrease");

    return cost;
  }
};