"use strict";

var constants = require("../constants");
var relation = require("../relationship");
var model = require("../model");

/**
 * Returns **true** if the **unit** is capable to self destruct.
 *
 * @param unit
 * @returns {boolean}
 */
exports.canSelfDestruct = function (unit) {
    if (!unit instanceof model.Unit) {
        throw new Error("IllegalArgumentType");
    }

    return unit.type.suicide !== undefined;
};

/**
 * Returns the **health** that will be damaged by an explosion of the exploder **unit**.
 *
 * @param unit
 * @returns {number}
 */
exports.getExplosionDamage = function (unit) {
    if (!unit instanceof model.Unit) {
        throw new Error("IllegalArgumentType");
    }

    return model.Unit.pointsToHealth(unit.type.suicide.damage);
};

/**
 * Returns the explosion **range** of the exploder **unit**.
 *
 * @param unit
 * @returns {number} range in tiles
 */
exports.getSuicideRange = function (unit) {
    if (!exports.canSelfDestruct(unit)) {
        throw new Error("IllegalArgumentType");
    }

    return unit.type.suicide.range;
};

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} tile
 * @param {number} damage
 */
var doDamage = function (x, y, tile, damage) {
    if (!model.isValidPosition(x, y) || !tile instanceof model.Tile || typeof damage !== "number") {
        throw new Error("IllegalArgumentType(s)");
    }

    if (tile.unit) {

        // TODO use command from attack here
        tile.unit.takeDamage(damage, 9);
    }
}
// TODO: silo should use this for the impact


/**
 * Invokes an explosion with a given **range** at position (**x**,**y**). All units in the **range** will be
 * damaged by the value **damage**. The health of an unit in range will never be lower than 9 health after
 * the explosion (means it will have 1HP left).
 *
 * @param {number} x
 * @param {number} y
 * @param {number} range
 * @param {number} damage
 */
var explode = function (x, y, range, damage) {
    if (!model.isValidPosition(x, y)) {
        throw new Error("IllegalArgumentType(s)");
    }

    var tile = model.getTile(x, y);
    if (!exports.canSelfDestruct(tile.unit) || range < 1 || damage < 1 ) {
        throw new Error("IllegalArgumentType(s)");
    }

    // TODO use command from attack here
    cwt.Lifecycle.destroyUnit(x, y, false);

    model.doInRange(x, y, range, doDamage, damage);
};

/* -----------------------------------------------  Module Actions ----------------------------------------------- */

exports.action = {
    noAutoWait: true,

    relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

    condition: function (unit) {
        return explode.canSelfDestruct(unit);
    },

    invoke: function (x, y, range, damage) {
        explode(x, y, range, damage);
    }
};