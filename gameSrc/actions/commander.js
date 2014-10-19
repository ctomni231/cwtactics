"use strict";

var constants = require("../constants");
var relation = require("../relationship");
var sheets = require("../sheets");
var model = require("../model");

// some config parameters
var cfgCoStartCostIncreaseSteps = require("../config").getConfig("co_getStarCostIncreaseSteps");
var cfgCoStartCostIncrease = require("../config").getConfig("co_getStarCostIncrease");
var cfgEnabledCoPower = require("../config").getConfig("co_enabledCoPower");
var cfgCoStartCost = require("../config").getConfig("co_getStarCost");


/**
 * Power level of normal CO power.
 *
 * @type {number}
 * @constant
 */
exports.POWER_LEVEL_COP = 0;

/**
 * Power level of normal super CO power.
 *
 * @type {number}
 * @constant
 */
exports.POWER_LEVEL_SCOP = 1;

/**
 * Modifies the power level of a **player** by a given **value**.
 *
 * @param player
 * @param value
 */
exports.modifyStarPower = function (player, value) {
    if (!player instanceof model.Player || typeof value === "number") {
        throw new Error("IllegalArgumentType");
    }

    player.power += value;

    // check left bound
    if (player.power < 0) {
        player.power = 0;
    }
};

/**
 * Returns **true** when a **player** can activate a **powerLevel**, else **false**. If the config
 * **co_enabledCoPower** if off then **false** will be returned in every situation.
 *
 * @param player
 * @param level
 * @returns {boolean}
 */
exports.canActivatePower = function (player, level) {
    if (!player instanceof model.Player || level < exports.POWER_LEVEL_COP || level > exports.POWER_LEVEL_SCOP) {
        throw new Error("IllegalArgumentType");
    }

    // TODO maybe better in the action itself
    // commanders must be available and current power must be inactive
    if (cfgEnabledCoPower.value === 0 || player.coA === null || player.activePower !== constants.INACTIVE) {
        return false;
    }

    var stars;
    switch (level) {

        case this.POWER_LEVEL_COP:
            stars = player.coA.coStars;
            break;

        case this.POWER_LEVEL_SCOP:
            if (model.gameMode < model.GAME_MODE_AW2) {
                throw new Error("GameModeActionIncompatibilityException");
            }

            stars = player.coA.scoStars;
            break;
    }

    return (player.power >= (exports.getStarCost(player) * stars));
};

/**
 * Activates a commander power **level** for a given **player**.
 *
 * @param player
 * @param level
 */
exports.activatePower = function (player, level) {
    if (!player instanceof model.Player || level < exports.POWER_LEVEL_COP || level > exports.POWER_LEVEL_SCOP) {
        throw new Error("IllegalArgumentType");
    }

    player.power = 0;
    player.activePower = level;
    player.powerUsed++;
};

/**
 * Deactivates the CO power of a **player** by setting the activePower to **cwt.INACTIVE**.
 *
 * @param player
 */
exports.deactivatePower = function (player) {
    if (!player instanceof model.Player) {
        throw new Error("IllegalArgumentType");
    }

    player.activePower = constants.INACTIVE;
};

/**
 * Returns the **costs** for one CO star for a **player**.
 *
 * @param player
 * @returns {exports.Config.value|*}
 */
exports.getStarCost = function (player) {
    if (!player instanceof model.Player) {
        throw new Error("IllegalArgumentType");
    }

    var cost = cfgCoStartCost.value;
    var used = player.powerUsed;

    // if usage counter is greater than max usage counter then use only the maximum increase counter for calculation
    if (used > cfgCoStartCostIncreaseSteps.value) {
        used = cfgCoStartCostIncreaseSteps.value;
    }

    cost += used * cfgCoStartCostIncrease.value;

    return cost;
};

/**
 * Sets the main Commander of a **player** to a given co **type**.
 *
 * @param player
 * @param type
 */
exports.setMainCo = function (player, type) {
    if (!player instanceof model.Player || !sheets.isValidId(sheets.TYPE_COMMANDER, type)) {
        throw new Error("IllegalArgumentType");
    }

    player.coA = type === null ? null : type;
};

/* -----------------------------------------------  Module Actions ----------------------------------------------- */

exports.actionActivate = {

    condition: function (player) {
        return exports.canActivatePower(player, exports.POWER_LEVEL_COP);
    },

    hasSubMenu: true,
    prepareMenu: function (player, menu) {
        menu.addEntry("cop");
        if (exports.canActivatePower(player, exports.POWER_LEVEL_SCOP)) {
            menu.addEntry("scop");
        }
    },

    invoke: function (playerId, powerLevel) {
        exports.activatePower(model.getPlayer(playerId), powerLevel);
    }
};

/*
 cwt.Action.unitAction({
 key:"attachCommander",

 condition: function(data){
 return model.events.attachCommander_check(

 model.round_turnOwner
 );
 },

 invoke: function( data ){
 controller.commandStack_sharedInvokement(
 "co_attachCommander",
 model.round_turnOwner,
 data.source.unitId
 );
 }
 });
 */

/*
 cwt.Action.unitAction({
 key:"detachCommander",

 condition: function(data){
 return model.events.detachCommander_check(

 model.round_turnOwner
 );
 },

 invoke: function( data ){
 controller.commandStack_sharedInvokement(
 "detachCommander_invoked",
 model.round_turnOwner,
 data.target.x,
 data.target.y
 );
 }
 });
 */
