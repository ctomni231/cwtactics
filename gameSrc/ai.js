"use strict";

var ai = require("./system/behaviourTree");
var actions = require("./actions");

var model = require("./model");

/*

 TARGETS FOR 0.38

 - capture
 - prevent recapture of own cities
 - dynamic indirect unit production
 - unit production

 */

var dumbBoyLogic = new ai.BehaviorTree(
    ai.Selector([

        require("./ai/co").data,

        require("./ai/preventEnemyCaptures").data,

        require("./ai/captureProperties").data,

        require("./ai/attackUnits").data,

        require("./ai/moveUnits").data,

        require("./ai/produceUnits").data,

        require("./ai/endingTurn").data

    ])
);

/* -------------------------------------------------- Module API -------------------------------------------------- */

/**
 * Registers a player as AI player. The player will be handled by the host instance of a game round instance.
 *
 * @param player
 */
exports.registerAiPlayer = function (player) {
    if (!player instanceof model.Player) {
        throw new Error("IllegalArgumentType");
    }

    throw new Error("NotImplementedException");
};

/**
 * Resets all given AI data.
 */
exports.resetAiData = function () {
    throw new Error("NotImplementedException");
};

/**
 * Makes a step for the AI state machine. The AI will do things here.
 *
 * @param player
 */
exports.tick = function (player) {
    if (!player instanceof model.Player) {
        throw new Error("IllegalArgumentType");
    }

    throw new Error("NotImplementedException");
};