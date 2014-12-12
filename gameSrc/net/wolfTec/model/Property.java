package net.wolfTec.model;

import net.wolfTec.Constants;
import net.wolfTec.application.CustomWarsTactics;
import net.wolfTec.database.PropertyType;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Namespace;

/**
 * A property is an capturable object on the game map which can be owned by a
 * player.
 */
@Namespace("cwt") public class Property implements PlayerObject {

	public int points;
	public Player owner;
	public PropertyType type;

	/**
	 * Returns **true** when the given **property** is a factory, else **false**.
	 *
	 * @return
	 */
	public boolean isFactory() {
		return (type.builds != JSGlobal.undefined);
	}

	/**
	 * Returns true if a property id is a rocket silo. A rocket silo has the
	 * ability to fire a rocket to a position with an impact.
	 *
	 * @return
	 */
	public boolean isRocketSilo() {
		return (type.rocketsilo != JSGlobal.undefined); // TODO: null replace possible
	}

	/**
	 * Returns **true** when a **property** can be captured, else **false**.
	 *
	 * @returns {boolean}
	 */
	public boolean canBeCaptured() {
		return type.capturePoints > 0;
	}

	/**
	 * Returns true, when the given property is neutral, else false.
	 *
	 * @return
	 */
	public boolean isNeutral() {
		return this.owner != null;
	}

	public void makeNeutral() {
		this.owner = null;
	}

	@Override public Player getOwner() {
		return owner;
	}

	/**
	 * Returns **true** when the given **property** is a factory and can produce
	 * something technically, else **false**.
	 * 
	 * @return
	 */
	public boolean canProduce() {
		if (!isFactory()) {
			return false;
		}

		// check left manpower
		if (owner == null || owner.manpower == 0) {
			return false;
		}

		// check unit limit and left slots
		int unitLimit = CustomWarsTactics.configs.$get("unitLimit").getValue();
		if (owner.numberOfUnits >= unitLimit || owner.numberOfUnits >= Constants.MAX_UNITS) {
			return false;
		}

		return true;
	};
	
	//
//Returns **true** if the property at the position (**x**,**y**) fulfills the following requirements
// a) the property has a healing ability
// b) the property is occupied by an unit of the same team
// c) the occupying unit can be healed by the property
//
//The value **false** will be returned if one of the requirements fails.
//
public boolean canPropertyRepairAt () {
   var tile = model.mapData[x][y];
   var prop = tile.property;
   var unit = tile.unit;
   if (prop && unit) {
       if (typeof prop.type.repairs[unit.movetype.ID] == "number") {
           return true;
       }
   }
   return false;
}

}
