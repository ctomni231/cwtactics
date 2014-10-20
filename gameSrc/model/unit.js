"use strict";

var constants = require("./constants");

/**
 *
 * @constructor
 */
exports.Unit = function () {
    this.hp = 99;
    this.ammo = 0;
    this.fuel = 0;
    this.hidden = false;
    this.loadedIn = constants.INACTIVE;
    this.type = null;
    this.canAct = false;
    this.owner = null;
};

exports.Unit.prototype = {

    /**
     *
     * @param type
     */
    initByType: function (type) {
        this.type = type;
        this.hp = 99;
        this.ammo = type.ammo;
        this.fuel = type.fuel;
        this.hidden = false;
        this.loadedIn = constants.INACTIVE;
        this.canAct = false;
    },

    /**
     *
     * @return {boolean}
     */
    isInactive: function () {
        return this.owner === null;
    },

    /**
     * Damages a unit.
     *
     * @param damage
     * @param minRest
     */
    takeDamage: function (damage, minRest) {
        this.hp -= damage;

        if (minRest && this.hp <= minRest) {
            this.hp = minRest;
        }
    },

    /**
     * Heals an unit. If the unit health will be greater than the maximum health value then the difference will be
     * added as gold to the owners gold depot.
     *
     * @param health
     * @param diffAsGold
     */
    heal: function (health, diffAsGold) {
        this.hp += health;
        if (this.hp > 99) {

            // pay difference of the result health and 100 as
            // gold ( in relation to the unit cost ) to the
            // unit owners gold depot
            if (diffAsGold === true) {
                var diff = this.hp - 99;
                this.owner.gold += parseInt((this.type.cost * diff) / 100, 10);
            }

            this.hp = 99;
        }
    },

    /**
     * @return {boolean} true when hp is greater than 0 else false
     */
    isAlive: function () {
        return this.hp > 0;
    },

    /**
     * Returns true when the unit ammo is lower equals 25%.
     *
     * @return {boolean}
     */
    hasLowAmmo: function () {
        var cAmmo = this.ammo;
        var mAmmo = this.type.ammo;
        if (mAmmo != 0 && cAmmo <= parseInt(mAmmo * 0.25, 10)) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Returns true when the unit fuel is lower equals 25%.
     *
     * @return {boolean}
     */
    hasLowFuel: function () {
        var cFuel = this.fuel;
        var mFuel = this.type.fuel;
        if (cFuel <= parseInt(mFuel * 0.25, 10)) {
            return true;
        } else {
            return false;
        }
    },

    /**
     *
     * @returns {boolean}
     */
    isCapturing: function () {
        if (this.loadedIn !== constants.INACTIVE) {
            return false;
        }

        return false;
        /*
         if( unit.x >= 0 ){
         var property = model.property_posMap[ unit.x ][ unit.y ];
         if( property !== null && property.capturePoints < 20 ){
         unitStatus.CAPTURES = true;
         }
         else unitStatus.CAPTURES = false;
         } */
    },

    setActable: function (value) {
        this.canAct = value;
    }
};


/**
 * Converts HP points to a health value.
 *
 * @example
 *  6 HP -> 60 health
 *  3 HP -> 30 health
 *
 * @param pt
 * @returns {number}
 */
exports.Unit.pointsToHealth = function (pt) {
    return (pt * 10);
};


/**
 * Converts and returns the HP points from the health value of an unit.
 *
 * @example
 *  health ->  HP
 *  69   ->   7
 *  05   ->   1
 *  50   ->   6
 *  99   ->  10
 *
 * @param health
 * @returns {number}
 */
exports.Unit.healthToPoints = function (health) {
    return parseInt(health / 10, 10) + 1;
};

/**
 * Gets the rest of unit health.
 *
 * @param health
 * @returns {number}
 */
exports.Unit.healthToPointsRest = function (health) {
    return health - (parseInt(health / 10) + 1);
};