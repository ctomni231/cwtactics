"use strict";

var constants = require("./constants");

/**
 * Object that holds information about objects at a given position (x,y).
 *
 * @constructor
 */
exports.PositionData = function () {
    this.x = -1;
    this.y = -1;
    this.tile = null;
    this.unit = null;
    this.property = null;
    this.unitId = -1;
    this.propertyId = -1;
};

exports.PositionData.prototype = {

    /**
     * Cleans all data of the object.
     */
    clean: function () {
        exports.PositionData.apply(this, null);
    },

    /**
     * Grabs the data from another position object.
     *
     * @param otherPos
     */
    grab: function (otherPos) {
        if (!otherPos instanceof exports.PositionData) {
            throw new Error("IllegalArgumentType");
        }

        this.x = otherPos.x;
        this.y = otherPos.y;
        this.tile = otherPos.tile;
        this.unit = otherPos.unit;
        this.unitId = otherPos.unitId;
        this.property = otherPos.property;
        this.propertyId = otherPos.propertyId;
    },

    /**
     * Sets a position.
     *
     * @param x
     * @param y
     */
    set: function (x, y) {
        var model = require("../model");

        this.clean();

        this.x = x;
        this.y = y;
        this.tile = model.getTile(x, y);

        if (this.tile.visionTurnOwner > 0 && this.tile.unit) {
            this.unit = this.tile.unit;
            this.unitId = exports.units.indexOf(this.tile.unit);
        }

        if (this.tile.property) {
            this.property = this.tile.property;
            this.propertyId = model.getPropertyId(this.tile.property);
        }
    }
};