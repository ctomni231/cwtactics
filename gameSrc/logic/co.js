"use strict";

var constants = require("../constants");
var assert = require("../functions").assert;
var model = require("../model");
var sheets = require("../sheets");

//
// Power level of normal CO power.
//
exports.POWER_LEVEL_COP = 0;

//
// Power level of normal super CO power.
//
exports.POWER_LEVEL_SCOP = 1;

//
// Modifies the power level of a **player** by a given **value**.
//
exports.modifyStarPower = function (player, value) {
  if (constants.DEBUG) assert(player instanceof model.Player);

  player.power += value;
  if (player.power < 0) player.power = 0;
};

//
// Returns **true** when a **player** can activate a **powerLevel**, else **false**. If the config
// **co_enabledCoPower** if off then **false** will be returned in every situation.
//
exports.canActivatePower = function (player, powerLevel) {
  if (cwt.Config.getValue("co_enabledCoPower") === 0) return false;

  if (constants.DEBUG) {
    assert(player instanceof model.Player && powerLevel >= constants.INACTIVE && powerLevel <= exports.POWER_LEVEL_SCOP);
  }

  // commanders must be available and current power must be inactive
  if (player.coA === null || player.activePower !== constants.INACTIVE) return false;

  var stars;
  switch (powerLevel) {

    case this.POWER_LEVEL_COP:
      stars = player.coA.coStars;
      break;

    case this.POWER_LEVEL_SCOP:
      if (model.gameMode < model.GAME_MODE_AW2) return false;
      stars = player.coA.scoStars;
      break;
  }

  return (player.power >= (this.getStarCost(player) * stars));
};

//
// Activates a commander power **level** for a given **player**.
//
exports.activatePower = function (player, level) {
  if (constants.DEBUG) {
    assert(player instanceof model.Player && (level === exports.POWER_LEVEL_COP || level === exports.POWER_LEVEL_SCOP));
  }

  player.power = 0;
  player.activePower = level;
  player.powerUsed++;
};

//
// Deactivates the CO power of a **player** by setting the activePower to **cwt.INACTIVE**.
//
exports.deactivatePower = function (player) {
  if (constants.DEBUG) assert(player instanceof model.Player);
  player.activePower = constants.INACTIVE;
};

//
// Returns the **costs** for one CO star for a **player**.
//
// @param {cwt.Player} player
//
exports.getStarCost = function (player) {
  if (constants.DEBUG) assert(player instanceof model.Player);

  var cost = cwt.Config.getValue("co_getStarCost");
  var used = player.powerUsed;

  // if usage counter is greater than max usage counter then use
  // only the maximum increase counter for calculation
  var maxUsed = cwt.Config.getValue("co_getStarCostIncreaseSteps");
  if (used > maxUsed) used = maxUsed;

  cost += used * cwt.Config.getValue("co_getStarCostIncrease");

  return cost;
};

//
// Sets the main Commander of a **player** to a given co **type**.
//
exports.setMainCo = function (player, type) {
  if (constants.DEBUG) assert(player instanceof model.Player);

  if (type === null) {
    player.coA = null;
  } else {
    if (constants.DEBUG) assert(sheets.commanders.isValidSheet(type));

    player.coA = type;
  }
};