"use strict";

var constants = require("../constants");
var assert = require("../system/functions").assert;
var model = require("../model");
var fog = require("../logic/fog");
var sheet = require("../sheets");

var cfgNoUnitsLeftLoose = require("../config").getConfig("noUnitsLeftLoose");

/**
 * Returns an inactive **unit object** or **null** if every slot in the unit list is used.
 *
 * @returns {*}
 */
exports.getInactiveUnit = function () {
    var i, e;
    for (i = 0, e = model.units.length; i < e; i++) {
        if (!model.units[i].owner) {
            return model.units[i];
        }
    }
    return null;
};

//
//
// @param {number} x
// @param {number} y
// @param {cwt.Player|cwt.Unit|cwt.Property} player
// @param type
//
exports.createUnit = function (x, y, player, type) {
    if (constants.DEBUG) assert(model.isValidPosition(x, y));

    var tile = model.mapData[x][y];

    if (constants.DEBUG) assert(player instanceof model.Player && player.numberOfUnits < constants.MAX_UNITS);

    var unit = exports.getInactiveUnit();

    // set references
    unit.owner = player;
    tile.unit = unit;
    player.numberOfUnits++;

    unit.initByType(sheet.units.sheets[type]);

    fog.addUnitVision(x, y, player);
};

//
//
// @param {number} x
// @param {number} y
// @param {boolean} silent
//
exports.destroyUnit = function (x, y, silent) {
    var tile = model.mapData[x][y];

    if (constants.DEBUG) assert(tile.unit);

    fog.removeUnitVision(x, y, tile.unit.owner);

    //TODO check loads

    // remove references
    var owner = tile.unit.owner;
    owner.numberOfUnits--;

    if (constants.DEBUG) assert(owner.numberOfUnits >= 0);

    tile.unit.owner = null;
    tile.unit = null;

    // end game when the player does not have any unit left
    if (cfgNoUnitsLeftLoose.value === 1 && owner.numberOfUnits === 0) {
        this.deactivatePlayer(owner);
    }
};

//
// A player has loosed the game round due a specific reason. This
// function removes all of his units and properties. Furthermore
// the left teams will be checked. If only one team is left then
// the end game event will be invoked.
//
// @param {cwt.Player} player
//
exports.deactivatePlayer = function (player) {

    // drop units
    if (constants.DEBUG) assert(player instanceof model.Player);

    for (var i = 0, e = model.units.length; i < e; i++) {
        var unit = model.units[i];
        if (unit.owner === player) {
            // TODO
        }
    }

    // drop properties
    for (var i = 0, e = model.properties.length; i < e; i++) {
        var prop = model.properties[i];
        if (prop.owner === player) {
            prop.makeNeutral();

            // TODO: change type when the property is a changing type property
            var changeType = prop.type.changeAfterCaptured;
        }
    }

    player.deactivate();

    // when no opposite teams are found then the game has ended
    if (!model.areEnemyTeamsLeft()) {
        // TODO
    }
};

//
//
// @return {boolean}
//
exports.hasFreeUnitSlot = function (player) {
    return player.numberOfUnits < model.Player.MAX_UNITS;
};

/* -----------------------------------------------  Module Actions ----------------------------------------------- */

exports.destroyUnitAction = {

};