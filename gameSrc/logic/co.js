//
// Module to control the commander mechanic of CWT.
//
cwt.CO = {

  //
  // Power level of normal CO power.
  //
  POWER_LEVEL_COP: 0,

  //
  // Power level of normal super CO power.
  //
  POWER_LEVEL_SCOP: 1,

  //
  // Modifies the power level of a **player** by a given **value**.
  //
  modifyStarPower: function(player, value) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.PlayerClass);

    player.power += value;
    if (player.power < 0) player.power = 0;
  },

  //
  // Returns **true** when a **player** can activate a **powerLevel**, else **false**. If the config
  // **co_enabledCoPower** if off then **false** will be returned in every situation.
  //
  canActivatePower: function(player, powerLevel) {
    if (cwt.Config.getValue("co_enabledCoPower") === 0) return false;

    if (this.DEBUG) {
      cwt.assert(player instanceof cwt.PlayerClass);
      cwt.assert(powerLevel >= cwt.INACTIVE && powerLevel <= this.POWER_LEVEL_SCOP);
    }

    // commanders must be available and current power must be inactive
    if (player.coA === null || player.activePower !== cwt.INACTIVE) return false;

    var stars;
    switch (powerLevel) {

      case this.POWER_LEVEL_COP:
        stars = player.coA.coStars;
        break;

      case this.POWER_LEVEL_SCOP:
        if (cwt.Model.gameMode < cwt.Model.GAME_MODE_AW2) return false;
        stars = player.coA.scoStars;
        break;
    }

    return (player.power >= (this.getStarCost(player) * stars));
  },

  //
  // Activates a commander power **level** for a given **player**.
  //
  activatePower: function(player, level) {
    if (this.DEBUG) {
      cwt.assert(player instanceof cwt.PlayerClass);
      cwt.assert(level === cwt.CO.POWER_LEVEL_COP || level === cwt.CO.POWER_LEVEL_SCOP);
    }

    player.power = 0;
    player.activePower = level;
    player.powerUsed++;
  },

  //
  // Deactivates the CO power of a **player** by setting the activePower to **cwt.INACTIVE**.
  //
  deactivatePower: function(player) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.PlayerClass);

    player.activePower = cwt.INACTIVE;
  },

  //
  // Returns the **costs** for one CO star for a **player**.
  //
  // @param {cwt.Player} player
  //
  getStarCost: function(player) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.PlayerClass);

    var cost = cwt.Config.getValue("co_getStarCost");
    var used = player.powerUsed;

    // if usage counter is greater than max usage counter then use
    // only the maximum increase counter for calculation
    var maxUsed = cwt.Config.getValue("co_getStarCostIncreaseSteps");
    if (used > maxUsed) used = maxUsed;

    cost += used * cwt.Config.getValue("co_getStarCostIncrease");

    return cost;
  },

  //
  // Sets the main Commander of a **player** to a given co **type**.
  //
  setMainCo: function(player, type) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.PlayerClass);

    if (type === null) {
      player.coA = null;
    } else {
      if (this.DEBUG) cwt.assert(cwt.DataSheets.commanders.isValidSheet(type));

      player.coA = type;
    }
  }
};
