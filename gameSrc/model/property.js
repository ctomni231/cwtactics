"use strict";

var constants = require("./constants");

/**
 *
 * @constructor
 */
exports.Property = function () {
    this.points = 20;

    /**
     *
     */
    this.owner = null;

    this.type = null;
};

exports.Property.prototype = {

    /**
     * Returns true, when the given property is neutral, else false.
     *
     * @returns {boolean}
     */
    isNeutral: function () {
        return this.owner === null;
    },

    makeNeutral: function () {
        this.owner = null;
    }

};

/**
 *
 * @type {number}
 * @constant
 */
exports.Property.CAPTURE_POINTS = 20;

/**
 *
 * @type {number}
 * @constant
 */
exports.Property.CAPTURE_STEP = 10;