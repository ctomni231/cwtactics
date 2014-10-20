"use strict";

var constants = require("./constants");

/**
 *
 *
 * @constructor
 */
exports.Tile = function () {
    this.type = null;
    this.unit = null;
    this.property = null;
    this.visionTurnOwner = 0;
    this.variant = 0;
    this.visionClient = 0;
};

exports.Tile.prototype = {

    /**
     *
     * @returns {boolean}
     */
    isOccupied: function () {
        return this.unit !== null;
    },

    /**
     *
     * @returns {boolean}
     */
    isVisible: function () {
        return this.visionTurnOwner > 0;
    }

};