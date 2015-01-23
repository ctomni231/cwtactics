package net.wolfTec.logic;

import net.wolfTec.cwt.Constants;
import net.wolfTec.model.Unit;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public interface SupplyLogic {

	/**
	 * @return **true** if a given **unit** is a supplier, else **false**.
	 *
	 * @param {Unit} unit
	 */
	default boolean isSupplier(Unit unit) {
		return unit.getType().supply != JSGlobal.undefined;
	}

	/**
	 * Drains fuel of a **unit** if it has the ability of daily fuel usage.
	 *
	 * @param {Unit} unit
	 */
	default void drainFuel(Unit unit) {
		int v = unit.getType().dailyFuelDrain;
		if (v != Constants.INACTIVE_ID) {

			// hidden units may drain more fuel
			if (unit.isHidden() && unit.getType().dailyFuelDrainHidden != Constants.INACTIVE_ID) {
				v = unit.getType().dailyFuelDrainHidden;
			}

			unit.setFuel(unit.getFuel() - v);
		}
	}

	/**
	 * Returns true when the unit ammo is lower equals 25%.
	 *
	 * @return {boolean}
	 */
	default boolean hasLowAmmo(Unit unit) {
		int cAmmo = unit.getAmmo();
		return (cAmmo != 0 && cAmmo <= (unit.getType().ammo * 0.25));
	}

	/**
	 * Returns true when the unit fuel is lower equals 25%.
	 *
	 * @return {boolean}
	 */
	default boolean hasLowFuel(Unit unit) {
		return (unit.getFuel() <= (unit.getType().fuel * 0.25));
	}

}
