package org.wolftec.cwt.logic;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.GameOptions;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.model.GameMode;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Player;
import org.wolftec.cwt.sheets.CommanderType;

public class CommanderLogic implements Injectable {

  //
  // Power level of normal CO power.
  //
  public final static int POWER_LEVEL_COP  = 0;

  //
  // Power level of normal super CO power.
  //
  public final static int POWER_LEVEL_SCOP = 1;

  private ModelManager    model;

  //
  // Modifies the power level of a **player** by a given **value**.
  //
  public void modifyStarPower(Player player, int value) {
    player.power += value;
    if (player.power < 0) {
      player.power = 0;
    }
  }

  //
  // Returns **true** when a **player** can activate a **powerLevel**, else
  // **false**. If the config
  // **co_enabledCoPower** if off then **false** will be returned in every
  // situation.
  //
  public boolean canActivatePower(Player player, int powerLevel) {
    if (GameOptions.co_enabledCoPower.value == 0) {
      return false;
    }

    // commanders must be available and current power must be inactive
    if (player.coA == null || player.activePower != Constants.INACTIVE) {
      return false;
    }

    int stars = 0;
    switch (powerLevel) {

      case POWER_LEVEL_COP:
        stars = player.coA.coStars;
        break;

      case POWER_LEVEL_SCOP:
        if (model.gameMode == GameMode.GAME_MODE_AW1) {
          return false;
        }
        stars = player.coA.scoStars;
        break;
    }

    return (player.power >= (this.getStarCost(player) * stars));
  }

  //
  // Activates a commander power **level** for a given **player**.
  //
  public void activatePower(Player player, int level) {
    player.power = 0;
    player.activePower = level;
    player.powerUsed++;
  }

  //
  // Deactivates the CO power of a **player** by setting the activePower to
  // **cwt.INACTIVE**.
  //
  public void deactivatePower(Player player) {
    player.activePower = Constants.INACTIVE;
  }

  //
  // Returns the **costs** for one CO star for a **player**.
  //
  // @param {cwt.Player} player
  //
  public int getStarCost(Player player) {
    int cost = GameOptions.co_getStarCost.value;
    int used = player.powerUsed;

    // if usage counter is greater than max usage counter then use
    // only the maximum increase counter for calculation
    int maxUsed = GameOptions.co_getStarCostIncreaseSteps.value;
    if (used > maxUsed) used = maxUsed;

    cost += used * GameOptions.co_getStarCostIncrease.value;

    return cost;
  }

  //
  // Sets the main Commander of a **player** to a given co **type**.
  //
  public void setMainCo(Player player, CommanderType type) {
    player.coA = type;
  }
}
