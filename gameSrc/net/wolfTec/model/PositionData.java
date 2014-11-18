package net.wolfTec.model;

import net.wolfTec.Constants;
import net.wolfTec.utility.Assert;
import org.stjs.javascript.annotation.Namespace;

/**
 * Object that holds information about objects at a given position (x,y).
 */
@Namespace("cwt")
public class PositionData {

    public int x;
    public int y;

    public Tile tile;
    public Unit unit;
    public Property property;

    public int unitId;
    public int propertyId;

    public PositionData () {
        this.clean();
    }

    /**
     * Cleans all data of the object.
     */
    public void clean () {
        this.x = -1;
        this.y = -1;

        this.tile = null;
        this.unit = null;
        this.property = null;

        this.unitId = Constants.INACTIVE_ID;
        this.propertyId = Constants.INACTIVE_ID;
    }

    /**
     * Grabs the data from another position object.
     *
     * @param otherPos
     */
    public void grab (PositionData otherPos) {
        Assert.notNull(otherPos);

        this.x = otherPos.x;
        this.y = otherPos.y;
        this.tile = otherPos.tile;
        this.unit = otherPos.unit;
        this.unitId = otherPos.unitId;
        this.property = otherPos.property;
        this.propertyId = otherPos.propertyId;
    }

    /**
     * Sets a position.
     *
     * @param x
     * @param y
     */
    public void set (int x, int y) {
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
}
