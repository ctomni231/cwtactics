package net.wolfTec.logic;

import net.wolfTec.CustomWarsTactics;
import net.wolfTec.model.Property;
import net.wolfTec.model.Unit;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public class SpecialWeaponsBean {

	public static boolean	$BEAN	= true;

	/**
	 * Returns **true** when the given **unit** is the mechanical laser trigger,
	 * else **false**.
	 *
	 * @return
	 */
	public boolean isLaser(Unit unit) {
		return (unit.getType().ID == CustomWarsTactics.LASER_UNIT_INV);
	}

	/**
	 * Returns **true** if a given **unit** is a cannon trigger unit, else
	 * **false**.
	 *
	 * @return
	 */
	public boolean isCannonUnit(Unit unit) {
		return (unit.getType().ID == CustomWarsTactics.CANNON_UNIT_INV);
	}

	/**
	 * Returns true if a property id is a rocket silo. A rocket silo has the
	 * ability to fire a rocket to a position with an impact.
	 *
	 * @return
	 */
	public boolean isRocketSilo(Property prop) {
		return (prop.type.rocketsilo != JSGlobal.undefined); // TODO: null replace
																													// possible
	}

}