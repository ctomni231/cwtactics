package net.wolfTec.logic;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Namespace;

import net.wolfTec.Constants;
import net.wolfTec.model.Player;
import net.wolfTec.model.Unit;
import net.wolfTec.utility.Assert;

@Namespace("cwt") public class Lifecycle {

	public static boolean	$BEAN	= true;

	/**
	 * 
	 * @param player
	 * @return
	 */
	public boolean isInactivePlayer(Player player) {
		return player.team != Constants.INACTIVE_ID;
	}

	/**
	 * 
	 * @param player
	 */
	public void deactivatePlayer(Player player) {
		player.team = Constants.INACTIVE_ID;
	}

	/**
	 * 
	 * @param player
	 * @param teamNumber
	 */
	public void activatePlayer(Player player, int teamNumber) {
		player.team = teamNumber;
	}

	/**
	 * @return {boolean}
	 */
	public boolean isInactiveUnit(Unit unit) {
		return unit.getOwner() == null;
	}

	/**
	 * Damages a unit.
	 *
	 * @param damage
	 * @param minRest
	 */
	public void damageUnit(Unit unit, int damage, int minRest) {
		Assert.greaterEquals(damage, 0);
		if (damage == 0) return;

		unit.setHp(unit.getHp() - damage);
		if (unit.getHp() < minRest) unit.setHp(minRest);
	}

	/**
	 * Heals an unit. If the unit health will be greater than the maximum health
	 * value then the difference will be added as gold to the owners gold depot.
	 *
	 * @param health
	 * @param diffAsGold
	 */
	public void healUnit(Unit unit, int health, boolean diffAsGold) {
		Assert.greaterEquals(health, 0);
		if (health == 0) return;

		unit.setHp(unit.getHp() + health);
		if (unit.getHp() > 99) {

			// pay difference of the result health and 100 as
			// gold ( in relation to the unit cost ) to the
			// unit owners gold depot
			if (diffAsGold == true) {
				int diff = unit.getHp() - 99;
				unit.getOwner().gold += JSGlobal.parseInt((unit.getType().cost * diff) / 100, 10);
			}

			unit.setHp(99);
		}
	}
}
