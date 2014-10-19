"use strict";

var constants = require("../constants");
var transport = require("./transport");
var relation = require("../relationship");
var sheets = require("../sheets");
var model = require("../model");
var team = require("../logic/team");

/**
 * Different available money transfer steps.
 *
 * @inner
 */
var MONEY_TRANSFER_STEPS = [
    1000,
    2500,
    5000,
    10000,
    25000,
    50000
];

/**
 * Returns `true` when a player can transfer money to a tile owner.
 *
 * @param player
 * @param x
 * @param y
 * @returns {*}
 */
exports.canTransferMoney = function (player, x, y) {
    if (player.gold < MONEY_TRANSFER_STEPS[0]) {
        return false;
    }

    // only transfer money on headquarters
    var property = model.getTile(x, y).property;
    return (property && property.type.looseAfterCaptured && property.owner !== player);
};

/**
 * Returns `true` when a player can transfer money to a tile owner.
 *
 * @param player
 * @param menuObject
 */
exports.getTransferMoneyTargets = function (player, menuObject) {
    var i, e;
    for (i = 0, e = MONEY_TRANSFER_STEPS.length; i < e; i++) {
        if (player.gold >= MONEY_TRANSFER_STEPS[i]) {
            menuObject.addEntry(MONEY_TRANSFER_STEPS[i]);
        }
    }
};

/**
 * Transfers money from one player to another player.
 *
 * @param playerA
 * @param playerB
 * @param money
 */
exports.transferMoney = function (playerA, playerB, money) {
    playerA.gold -= money;
    playerB.gold += money;

    // the amount of gold cannot be lower 0 after the transfer
    assert(playerA.gold >= 0);
};

/**
 *
 * @param unit
 * @returns {boolean}
 */
exports.canTransferUnit = function (unit) {

    if (constants.DEBUG) {
        assert(unit instanceof model.Unit);
    }

    return !transport.hasLoads(unit);
};

/**
 *
 * @param player
 * @param menu
 */
exports.getUnitTransferTargets = function (player, menu) {
    if (constants.DEBUG) assert(player instanceof model.Player);

    var origI = player.ID;
    for (var i = 0, e = constants.MAX_PLAYER; i < e; i++) {
        if (i === origI) continue;

        var player = model.getPlayer(i);
        if (!player.isInactive() && player.numberOfUnits < constants.MAX_UNITS) {
            menu.addEntry(i, true);
        }
    }
};

/**
 *
 * @param unit
 * @param player
 */
exports.transferUnitToPlayer = function (unit, player) {
    if (constants.DEBUG) {
        assert(unit instanceof model.Unit);
        assert(player instanceof model.Player);
    }

    var origPlayer = unit.owner;

    if (constants.DEBUG) assert(player.numberOfUnits < constants.MAX_UNITS);

    origPlayer.numberOfUnits--;
    unit.owner = player;
    player.numberOfUnits++;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team !== player.team) {
        model.searchUnit(unit, this.changeVision_, null, origPlayer);
    }
};

/**
 *
 * @param property
 * @returns {boolean}
 */
exports.canTransferProperty = function (property) {
    return (property.type.notTransferable !== true);
};

/**
 *
 * @param player
 * @param menu
 */
exports.getPropertyTransferTargets = function (player, menu) {
    var origI = player.id;
    for (var i = 0, e = constants.MAX_PLAYER; i < e; i++) {
        if (i === origI) continue;

        var player = model.players[i];
        if (!player.isInactive()) {
            menu.addEntry(i, true);
        }
    }
};

var changeVision_ = function (x, y, object, oldOwner) {
    if (object instanceof model.Unit) {
        cwt.Fog.removeUnitVision(x, y, oldOwner);
        cwt.Fog.addUnitVision(x, y, object.owner);
    } else {
        cwt.Fog.removePropertyVision(x, y, oldOwner);
        cwt.Fog.addPropertyVision(x, y, object.owner);
    }
};

//
//
//
exports.transferPropertyToPlayer = function (property, player) {
    var origPlayer = property.owner;
    property.owner = player;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team !== player.team) {
        // TODO
        model.searchProperty(property, changeVision_, null, origPlayer);
    }
};

/* ------------------------------------------------ Module Actions ------------------------------------------------ */

exports.actionMoney = {
    condition: function (player, x, y) {
        return team.canTransferMoney(player, x, y);
    },

    hasSubMenu: true,
    prepareMenu: function (player, menu) {
        team.getTransferMoneyTargets(player, menu);
    },

    invoke: function (sourcePlayerId, targetPlayerId, money) {
        team.transferMoney(model.getPlayer(sourcePlayerId), model.getPlayer(targetPlayerId), money);
    }
};

exports.actionProperty = {
    relationToProp: ["S", "T", relation.RELATION_SAME_THING],

    condition: function (property) {
        return team.canTransferProperty(property);
    },

    hasSubMenu: true,
    prepareMenu: function (player, menu) {
        team.getPropertyTransferTargets(player, menu);
    },

    invoke: function (propertyId, targetPlayerId) {
        team.transferPropertyToPlayer(model.getProperty(propertyId), model.getPlayer(targetPlayerId));
    }
};

exports.actionUnit = {
    relation: ["S", "T", relation.RELATION_SAME_THING],

    condition: function (unit) {
        return team.canTransferUnit(unit);
    },

    hasSubMenu: true,
    prepareMenu: function (player, menu) {
        team.getUnitTransferTargets(player, menu);
    },

    invoke: function (unitId, targetPlayerId) {
        team.transferUnitToPlayer(model.getUnit(unitId), model.getPlayer(targetPlayerId));
    }
};
