package net.wolfTec.cwt.model;

import net.wolfTec.cwt.Constants;
import net.wolfTec.cwt.util.AssertUtil;

import org.stjs.javascript.annotation.Namespace;

/**
 * Object that holds information about objects at a given position (x,y).
 */
@Namespace("cwt") public class Position {

	public int			x;
	public int			y;

	public Tile			tile;
	public Unit			unit;
	public Property	property;

	public int			unitId;
	public int			propertyId;

	public Position() {
		this.clean();
	}

	/**
	 * Cleans all data of the object.
	 */
	public void clean() {
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
	public void grab(Position otherPos) {
		AssertUtil.notNull(otherPos);

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
	public void set(int x, int y) {
		this.clean();

		this.x = x;
		this.y = y;
		this.tile = net.wolfTec.gameround.map.getTile(x, y);

		if (tile.visionTurnOwner > 0 && this.tile.unit != null) {
			this.unit = tile.unit;
			this.unitId = net.wolfTec.gameround.units.indexOf(tile.unit);
		}

		if (tile.property != null) {
			property = tile.property;
			propertyId = CustomWarsTactics.gameround.getPropertyId(tile.property);
		}
	}
	 *
	 * @param x
	 * @param y
	 */
}
