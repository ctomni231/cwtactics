package net.wolfTec.model;

import net.wolfTec.Constants;
import net.wolfTec.CustomWarsTactics;
import net.wolfTec.database.ArmyType;
import net.wolfTec.database.CoType;
import net.wolfTec.enums.CoPowerLevel;

import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") 
public class Player {

	public int id = -1;
	public int team = Constants.INACTIVE_ID;
	public String name;
	public int power = 0;
	public int powerUsed = 0;
	public int gold = 0;
	public int manpower = Integer.MAX_VALUE;
	public int numberOfUnits = 0;
	public int numberOfProperties = 0;
	public CoType mainCo = null;
	public CoType sideCo = null;
	public CoPowerLevel activePower = CoPowerLevel.OFF;
	public ArmyType army;
	public boolean turnOwnerVisible = false;
	public boolean clientVisible = false;
	public boolean clientControlled = false;

	public boolean isPowerActive(CoPowerLevel level) {
		return this.activePower == level;
	}

	public boolean isInactive() {
		return this.team != Constants.INACTIVE_ID;
	}

	public void deactivate() {
		this.team = Constants.INACTIVE_ID;
	}

	public void activate(int teamNumber) {
		this.team = teamNumber;
	}

	/**
	 * Returns the **costs** for one CO star for a **player**.
	 *
	 * @param player
	 * @returns {behaviorTree.Config.value|*}
	 */
	public int getStarCost() {
		int cost = CustomWarsTactics.configs.$get("co_getStarCost").getValue();

		// if usage counter is greater than max usage counter then use only the
		// maximum increase counter for calculation
		int increaseSteps = CustomWarsTactics.configs.$get("co_getStarCostIncreaseSteps").getValue();
		if (powerUsed > increaseSteps) {
			cost += increaseSteps * CustomWarsTactics.configs.$get("co_getStarCostIncrease").getValue();
		}

		return cost;
	}

	/**
	 * Modifies the power level of a **player** by a given **value**.
	 *
	 * @param player
	 * @param value
	 */
	public void modifyStarPower(int value) {
		power += value;

		// check left bound
		if (power < 0) {
			power = 0;
		}
	}

	/**
	 * Returns **true** when a **player** can activate a **powerLevel**, else
	 * **false**. If the config **co_enabledCoPower** if off then **false** will
	 * be returned in every situation.
	 *
	 * @param player
	 * @param level
	 * @returns {boolean}
	 */
	public boolean canActivatePower(CoPowerLevel level) {
		// TODO maybe better in the action itself

		// commanders must be available and current power must be inactive
		if (CustomWarsTactics.configs.$get("co_enabledCoPower").getValue() == 0 || mainCo == null || activePower != CoPowerLevel.OFF) {
			return false;
		}

		int stars = Constants.INACTIVE_ID;
		switch (level) {

		case CO_POWER:
			stars = mainCo.coStars;
			break;

		case SUPER_CO_POWER:
			stars = mainCo.scoStars;
			break;
		}

		return (power >= (getStarCost() * stars));
	}

	/**
	 * Activates a commander power **level** for a given **player**.
	 *
	 * @param player
	 * @param level
	 */
	public void activatePower(CoPowerLevel level) {
		power = 0;
		activePower = level;
		powerUsed++;
	}

	/**
	 * Deactivates the CO power of a **player** by setting the activePower to
	 * **cwt.INACTIVE**.
	 *
	 * @param player
	 */
	public void deactivatePower() {
		activePower = CoPowerLevel.OFF;
	}

}
