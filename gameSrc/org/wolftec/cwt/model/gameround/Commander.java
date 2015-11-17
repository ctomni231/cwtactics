package org.wolftec.cwt.model.gameround;

import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.annotations.OptionalField;
import org.wolftec.cwt.model.Specialization;
import org.wolftec.cwt.model.sheets.types.CommanderType;
import org.wolftec.cwt.model.tags.TagValue;

public class Commander extends Specialization<Player> {

  public final static int POWER_LEVEL_OFF = 0;
  public final static int POWER_LEVEL_COP = 1;
  public final static int POWER_LEVEL_SCOP = 2;
  public final static int POWER_LEVEL_TAG = 3;

  private TagValue cfgStarCost;
  private TagValue cfgStarCostIncrease;
  private TagValue cfgStarCostIncreaseSteps;
  private TagValue cfgCoLevel;

  @OptionalField public CommanderType coA;
  @OptionalField public CommanderType coB;

  public Commander() {
    cfgCoLevel = new TagValue("game.co.level", POWER_LEVEL_OFF, POWER_LEVEL_TAG, POWER_LEVEL_SCOP);
    cfgStarCost = new TagValue("game.co.stars.cost", 100, 50000, 9000, 100);
    cfgStarCostIncrease = new TagValue("game.co.stars.cost.increase.value", 0, 50000, 1800, 100);
    cfgStarCostIncreaseSteps = new TagValue("game.co.stars.cost.increase.steps", 0, 50, 10);
  }

  /**
   * 
   * @param player
   * @param value
   */
  public void modifyPlayerCoPower(int value) {
    self.power += value;
    if (self.power < 0) {
      self.power = 0;
    }
  }

  /**
   * 
   * @param player
   * @param powerLevel
   * @return
   */
  public boolean canActivatePower(int powerLevel) {
    if (cfgCoLevel.value < powerLevel) {
      return false;
    }

    // commanders must be available and current power must be inactive
    if (coA == null || self.activePower != POWER_LEVEL_OFF) {
      return false;
    }

    int stars = 0;
    switch (powerLevel) {

      case POWER_LEVEL_COP:
        stars = coA.coStars;
        break;

      case POWER_LEVEL_SCOP:
        stars = coA.scoStars;
        break;
    }

    return (self.power >= (getStarCost(self) * stars));
  }

  /**
   * 
   * @param player
   * @param level
   */
  public void activatePower(int level) {
    self.power = 0;
    self.activePower = level;
    self.powerUsed++;
  }

  /**
   * 
   * @param player
   */
  public void deactivatePower() {
    self.activePower = Constants.INACTIVE;
  }

  /**
   * 
   * @param player
   * @return
   */
  public int getStarCost(Player player) {
    int cost = cfgStarCost.value;
    int used = player.powerUsed;

    // if usage counter is greater than max usage counter then use
    // only the maximum increase counter for calculation
    int maxUsed = cfgStarCostIncreaseSteps.value;
    if (used > maxUsed) used = maxUsed;

    cost += used * cfgStarCostIncrease.value;

    return cost;
  }

  public void addActivatableLevelsToList(Callback1<Integer> levelCb) {
    for (int i = POWER_LEVEL_COP; i <= POWER_LEVEL_SCOP; i++) {
      if (canActivatePower(i)) {
        levelCb.$invoke(i);
      }
    }
  }

  public boolean isValidPowerlevel(int level) {
    return level >= POWER_LEVEL_OFF && level <= POWER_LEVEL_SCOP;
  }

  /**
   * @param player
   * @param type
   */
  public void setMainCo(CommanderType type) {
    coA = type;
  }
}
