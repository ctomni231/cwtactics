"use strict";

var transport = require("./transport");
var constants = require("../constants");
var relation = require("../relationship");
var model = require("../model");
var join = require("../logic/join");

/**
 * Returns **true** if two units can join each other, else **false**. In general both **source** and **target** has
 * to be units of the same type and the target must have 9 or less health points. Transporters cannot join each
 * other when they contain loaded units.
 *
 * @param source
 * @param target
 * @returns {boolean}
 */
exports.canJoin = function (source, target) {
    if (!source instanceof model.Unit || !target instanceof model.Unit) {
        throw new Error("IllegalArgumentType(s)");
    }

    if (source.type !== target.type) {
        return false;
    }


    // don't increase HP to more then 10
    if (target.hp >= 90) {
        return false;
    }

    // do they have loads?
    if (transport.hasLoads(source) || transport.hasLoads(target)) return false;

    return true;
};

/**
 * Joins two units together. If the combined health is greater than the maximum health then the difference will
 * be payed to the owners resource depot.
 *
 * @param source
 * @param x
 * @param y
 */
exports.join = function (source, x, y) {
    if (!source instanceof model.Unit || !model.isValidPosition(x, y)) {
        throw new Error("IllegalArgumentType(s)");
    }

    var target = model.getTile(x, y).unit;
    if (source.type !== target.type) {
        throw new Error("IncompatibleJoinTypes");
    }

    // hp
    target.heal(model.Unit.pointsToHealth(model.Unit.healthToPoints(source)), true);

    // ammo
    target.ammo += source.ammo;
    if (target.ammo > target.type.ammo) {
        target.ammo = target.type.ammo;
    }

    // fuel
    target.fuel += source.fuel;
    if (target.fuel > target.type.fuel) {
        target.fuel = target.type.fuel;
    }

    // TODO experience points

    // TODO use correct action here
    cwt.Lifecycle.destroyUnit(x, y, true);
};

/* -----------------------------------------------  Module Actions ----------------------------------------------- */

exports.action = {
    noAutoWait: true,

    relation: ["S", "T", relation.RELATION_OWN],

    condition: function (sourceUnit, targetUnit) {
        return join.canJoin(sourceUnit, targetUnit);
    },

    invoke: function (sourceUnitId, x, y) {
        // TODO: better is sx,sy,tx,ty
        join.join(model.getUnit(sourceUnitId), x, y);
    }

};