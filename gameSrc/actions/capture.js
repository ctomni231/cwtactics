"use strict";

var constants = require("../constants");
var relation = require("../relationship");
var model = require("../model");

/**
 * Returns **true** when a **unit** can capture a properties, else **false**.
 *
 * @param unit
 * @returns {boolean}
 */
exports.canCapture = function (unit) {
    if (!unit instanceof model.Unit) {
        throw new Error("IllegalArgumentType");
    }

    return (unit.type.captures > 0);
};

/**
 * Returns **true** when a **property** can be captured, else **false**.
 *
 * @param property
 * @returns {boolean}
 */
exports.canBeCaptured = function (property) {
    if (!property instanceof model.Property) {
        throw new Error("IllegalArgumentType");
    }

    return (property.type.capturePoints > 0);
};

/**
 * The **unit** captures the **property**. When the capture points of the **property** falls down to zero, then
 * the owner of the **property** changes to the owner of the capturing **unit** and **true** will be returned. If
 * the capture points does not fall down to zero then **false** will be returned.
 *
 * @param property
 * @param unit
 * @returns {boolean} true when captured successfully, else when still some capture points left
 */
exports.captureProperty = function (property, unit) {
    if (!property instanceof model.Property || !unit instanceof model.Unit) {
        throw new Error("IllegalArgumentType");
    }

    property.points -= model.Property.CAPTURE_STEP;
    if (property.points <= 0) {
        property.owner = unit.owner;
        property.points = model.Property.CAPTURE_POINTS;
        // TODO: if max points are static then the configurable points from the property sheets can be removed

        // was captured
        return true;
    }

    // was not captured
    return false;
};

/* -----------------------------------------------  Module Actions ----------------------------------------------- */

exports.action = {
    relation: ["S", "T", relation.RELATION_SAME_THING, relation.RELATION_NONE],
    relationToProp: ["S", "T", relation.RELATION_ENEMY, relation.RELATION_NEUTRAL],

    condition: function (unit, property) {
        return ( exports.canCapture(unit) && exports.canBeCaptured(property));
    },

    invoke: function (propertyId, unitId) {
        exports.captureProperty(
            model.getProperty(propertyId),
            model.getUnit(unitId)
        );
    }
};