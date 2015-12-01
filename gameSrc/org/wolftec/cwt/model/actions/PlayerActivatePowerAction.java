package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.model.ActionData;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.tags.TagValue;

public class PlayerActivatePowerAction extends AbstractAction {

  public final static int POWER_LEVEL_OFF = 0;
  public final static int POWER_LEVEL_COP = 1;
  public final static int POWER_LEVEL_SCOP = 2;
  public final static int POWER_LEVEL_TAG = 3;

  private TagValue cfgStarCost;
  private TagValue cfgStarCostIncrease;
  private TagValue cfgStarCostIncreaseSteps;
  private TagValue cfgCoLevel;

  public PlayerActivatePowerAction() {
    cfgCoLevel = new TagValue("game.co.level", POWER_LEVEL_OFF, POWER_LEVEL_TAG, POWER_LEVEL_SCOP);
    cfgStarCost = new TagValue("game.co.stars.cost", 100, 50000, 9000, 100);
    cfgStarCostIncrease = new TagValue("game.co.stars.cost.increase.value", 0, 50000, 1800, 100);
    cfgStarCostIncreaseSteps = new TagValue("game.co.stars.cost.increase.steps", 0, 50, 10);
  }

  @Override
  public String key() {
    return "activatePower";
  }

  @Override
  public ActionType type() {
    return ActionType.MAP_ACTION;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    return canActivateLevel(controller.ui.actor, POWER_LEVEL_COP);
  }

  private int getStarCost(Player player) {
    int cost = cfgStarCost.value;
    int used = player.powerUsed;

    // if usage counter is greater than max usage counter then use
    // only the maximum increase counter for calculation
    int maxUsed = cfgStarCostIncreaseSteps.value;
    if (used > maxUsed) used = maxUsed;

    cost += used * cfgStarCostIncrease.value;

    return cost;
  }

  private boolean canActivateLevel(Player player, int powerLevel) {
    if (cfgCoLevel.value < powerLevel) {
      return false;
    }

    // commanders must be available and current power must be inactive
    if (player.commander.coA == null || player.activePower != POWER_LEVEL_OFF) {
      return false;
    }

    int stars = 0;
    switch (powerLevel) {

      case POWER_LEVEL_COP:
        stars = player.commander.coA.coStars;
        break;

      case POWER_LEVEL_SCOP:
        stars = player.commander.coA.scoStars;
        break;
    }

    return (player.power >= (getStarCost(player) * stars));
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public void prepareActionMenu(ModelData model, ControllerData controller) {
    for (int i = POWER_LEVEL_COP; i <= POWER_LEVEL_SCOP; i++) {
      if (canActivateLevel(controller.ui.actor, i)) {
        controller.ui.addInfo(i + "", true);
      }
    }
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.actor.id;
    controller.data.p2 = controller.ui.actionDataCode;
  }

  private boolean isValidPowerlevel(int level) {
    return level >= POWER_LEVEL_OFF && level <= cfgCoLevel.value;
  }

  @Override
  public void checkData(ModelData model, ActionData data) {
    AssertUtil.assertThat(model.battlefield.players.isValidPlayerId(data.p1), "");
    AssertUtil.assertThat(isValidPowerlevel(data.p2), "");
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Player player = model.battlefield.players.getPlayer(controller.data.p1);
    int powerLevel = controller.data.p2;

    player.power = 0;
    player.activePower = powerLevel;
    player.powerUsed++;
  }

}
