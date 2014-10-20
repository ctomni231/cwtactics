"use strict";

var constants = require("./constants");

/**
 * Player class which holds all parameters of a army owner.
 *
 * @constructor
 */
exports.Player =function () {
    this.id = -1;
    this.team = constants.INACTIVE;
    this.name = null;

    this.coA = null;
    this.activePower = constants.INACTIVE;
    this.power = 0;
    this.powerUsed = 0;

    this.gold = 0;
    this.manpower = Math.POSITIVE_INFINITY;

    this.numberOfUnits = 0;
    this.numberOfProperties = 0;

    this.turnOwnerVisible = false;
    this.clientVisible = false;
    this.clientControlled = false;
};

exports.Player.prototype = {

    isPowerActive: function (level) {
        return this.activePower === level;
    },

    isInactive: function () {
        return this.team !== constants.INACTIVE;
    },

    deactivate: function () {
        this.team = constants.INACTIVE;
    },

    activate: function (teamNumber) {
        this.team = teamNumber;
    },

    reset: function () {
        this.team = constants.INACTIVE;
        this.name = null;
        this.coA = null;
        this.activePower = constants.INACTIVE;
        this.power = 0;
        this.powerUsed = 0;
        this.gold = 0;
        this.manpower = Math.POSITIVE_INFINITY;
        this.numberOfUnits = 0;
        this.numberOfProperties = 0;
        this.turnOwnerVisible = false;
        this.clientVisible = false;
        this.clientControlled = false;
    }
};