package net.wolfTec.logic;

import org.stjs.javascript.annotation.Namespace;

import net.wolfTec.Constants;
import net.wolfTec.model.CoPowerLevel;
import net.wolfTec.model.Player;

@Namespace("cwt") public class $Commander {

	public static boolean	$BEAN	= true;
	private $GameConfig		$gameconfig;

	public boolean isPowerActive(Player player, CoPowerLevel level) {
		return player.activePower == level;
	}

	/**
	 * Returns the **costs** for one CO star for a **player**.
	 *
	 * @param player
	 * @returns {behaviorTree.Config.value|*}
	 */
	public int getStarCost(Player player) {
		int cost = $gameconfig.getConfigValue("co_getStarCost");

		// if usage counter is greater than max usage counter then use only the
		// maximum increase counter for calculation
		int increaseSteps = $gameconfig.getConfigValue("co_getStarCostIncreaseSteps");
		if (player.powerUsed > increaseSteps) {
			cost += increaseSteps * $gameconfig.getConfigValue("co_getStarCostIncrease");
		}

		return cost;
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
	public boolean canActivatePower(Player player, CoPowerLevel level) {
		// TODO maybe better in the action itself

		// commanders must be available and current power must be inactive
		if ($gameconfig.getConfigValue("co_enabledCoPower") == 0 || player.mainCo == null || player.activePower != CoPowerLevel.OFF) {
			return false;
		}

		int stars = Constants.INACTIVE_ID;
		switch (level) {

			case OFF:
				return true;

			case CO_POWER:
				stars = player.mainCo.coStars;
				break;

			case SUPER_CO_POWER:
				stars = player.mainCo.scoStars;
				break;

			case TAG_CO_POWER:
				return false;
		}

		return (player.power >= (getStarCost(player) * stars));
	}

	/**
	 * Activates a commander power **level** for a given **player**.
	 *
	 * @param player
	 * @param level
	 */
	public void activatePower(Player player, CoPowerLevel level) {
		player.power = 0;
		player.activePower = level;
		player.powerUsed++;
	}

	/**
	 * Deactivates the CO power of a **player** by setting the activePower to
	 * **cwt.INACTIVE**.
	 *
	 * @param player
	 */
	public void deactivatePower(Player player) {
		player.activePower = CoPowerLevel.OFF;
	}

}
