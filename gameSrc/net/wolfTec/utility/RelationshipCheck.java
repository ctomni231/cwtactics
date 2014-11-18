package net.wolfTec.utility;

import net.wolfTec.enums.Relationship;

public class RelationshipCheck {

/**
 * Extracts the relationship between the object left and the object right and returns the correct
 * RELATION_{?} constant. The check mode can be set by checkLeft and checkRight.
 *
 * @param left
 * @param right
 * @param checkLeft
 * @param checkRight
 * @returns {number}
 */
    public Relationship getRelationShipTo (left, right, RelationshipCheck checkLeft, RelationshipCheck checkRight) {
        var oL;
        var oR;

        if (checkLeft !== exports.CHECK_PROPERTY) {
            oL = left.unit;
        }
        if (checkRight !== exports.CHECK_PROPERTY) {
            oR = right.unit;
        }

        if (!oL && checkLeft !== exports.CHECK_UNIT) {
            oL = left.property;
        }
        if (!oR && checkRight !== exports.CHECK_UNIT) {
            oR = right.property;
        }

        if (!oL) {
            return exports.RELATION_NONE;
        }

        return getRelationship(oL, oR);
    };

    /**
     * Extracts the relationship between objectA and objectB* and returns the correct RELATION_{?} constant.
     *
     * @param objectA
     * @param objectB
     * @returns {*}
     */
    public Relationship getRelationship (objectA, objectB) {

        // one object is null
        if (objectA === null || objectB === null) {
            return exports.RELATION_NONE;
        }

        // same object
        if (objectA === objectB) {
            return exports.RELATION_SAME_THING;
        }

        var playerA = (objectA instanceof model.Player) ? objectA : objectA.owner;
        var playerB = (objectB instanceof model.Player) ? objectB : objectB.owner;

        // one of the owners is inactive or not set (e.g. neutral properties)
        if (playerA == null || playerB == null || playerA.team == -1 || playerB.team == -1) {
            return Relationship.RELATION_NEUTRAL;
        }

        // same side
        if (playerA === playerB) {
            return Relationship.RELATION_OWN;
        }

        // allied or enemy ?
        if (playerA.team === playerB.team) {
            return Relationship.RELATION_ALLIED;
        }

        return Relationship.RELATION_ENEMY;
    };

/**
 * Returns true if there is at least one unit with a given relationship to player in one of the
 * neighbours of a given position (x,y). If not, false will be returned.
 *
 * @param player
 * @param x
 * @param y
 * @param relationship
 * @returns {boolean}
 */
    exports.hasUnitNeighbourWithRelationship =

    RelationshipCheck(player, x, y, relationship) {
        if (!model.isValidPosition(x, y) || !player instanceof model.Player) {
            throw new Error("IllegalArgumentType");
        }

        var unit;

        // WEST
        if (x > 0) {
            unit = model.getTile(x - 1, y).unit;
            if (unit && exports.getRelationship(player, unit.owner) === relationship) {
                return true;
            }
        }

        // NORTH
        if (y > 0) {
            unit = model.getTile(x, y - 1).unit;
            if (unit && exports.getRelationship(player, unit.owner) === relationship) {
                return true;
            }
        }

        // EAST
        if (x < model.mapWidth - 1) {
            unit = model.getTile(x + 1, y).unit;
            if (unit && exports.getRelationship(player, unit.owner) === relationship) {
                return true;
            }
        }

        // SOUTH
        if (y < model.mapHeight - 1) {
            unit = model.getTile(x, y + 1).unit;
            if (unit && exports.getRelationship(player, unit.owner) === relationship) {
                return true;
            }
        }

        return false;
    };
}
