package net.wolfTec.cwt.logic;

import net.wolfTec.cwt.Game;
import net.wolfTec.cwt.model.Property;
import net.wolfTec.cwt.model.Unit;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public interface SpecialWeaponsLogic {

	/**
	 * Returns **true** when the given **unit** is the mechanical laser trigger,
	 * else **false**.
	 *
	 * @return
	 */
	default boolean isLaser(Unit unit) {
		return (unit.getType().ID == Game.LASER_UNIT_INV);
	}

	/**
	 * Returns **true** if a given **unit** is a cannon trigger unit, else
	 * **false**.
	 *
	 * @return
	 */
	default boolean isCannonUnit(Unit unit) {
		return (unit.getType().ID == Game.CANNON_UNIT_INV);
	}

	/**
	 * Returns true if a property id is a rocket silo. A rocket silo has the
	 * ability to fire a rocket to a position with an impact.
	 *
	 * @return
	 */
	default boolean isRocketSilo(Property prop) {
		return (prop.type.rocketsilo != JSGlobal.undefined); // TODO: null replace
																													// possible
	}

}