package net.wolfTec.logic;

import org.stjs.javascript.annotation.Namespace;

import net.wolfTec.cwt.Constants;
import net.wolfTec.model.CoPowerLevel;
import net.wolfTec.model.Player;

@Namespace("cwt") public interface CommanderLogic extends BaseLogic {

  default boolean isPowerActive(Player player, CoPowerLevel level) {
    return player.activePower == level;
  }

  /**
   * Returns the **costs** for one CO star for a **player**.
   *
   * @param player
   * @returns {behaviorTree.Config.value|*}
   */
  default int getStarCost(Player player) {
    int cost = getGameConfig().getConfigValue("co_getStarCost");

    // if usage counter is greater than max usage counter then use only the
    // maximum increase counter for calculation
    int increaseSteps = getGameConfig().getConfigValue("co_getStarCostIncreaseSteps");
    if (player.powerUsed > increaseSteps) {
      cost += increaseSteps * getGameConfig().getConfigValue("co_getStarCostIncrease");
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
  default boolean canActivatePower(Player player, CoPowerLevel level) {
    // TODO maybe better in the action itself

    // commanders must be available and current power must be inactive
    if (getGameConfig().getConfigValue("co_enabledCoPower") == 0 || player.mainCo == null
        || player.activePower != CoPowerLevel.OFF) {
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
  default void activatePower(Player player, CoPowerLevel level) {
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
  default void deactivatePower(Player player) {
    player.activePower = CoPowerLevel.OFF;
  }
}
