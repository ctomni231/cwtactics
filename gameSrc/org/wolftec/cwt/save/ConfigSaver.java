package org.wolftec.cwt.save;

import org.stjs.javascript.Map;
import org.wolftec.cwt.config.OptionsManager;

public class ConfigSaver implements AppHandler<Map<String, Integer>>, GameHandler<Map<String, Integer>> {

  private OptionsManager options;

  @Override
  public void onAppLoad(Map<String, Integer> data) {
    data.$put("fastClickMode", options.fastClickMode.value);
    data.$put("animatedTiles", options.animatedTiles.value);
    data.$put("forceTouch", options.forceTouch.value);
  }

  @Override
  public void onAppSave(Map<String, Integer> data) {
    options.fastClickMode.setValue(data.$get("fastClickMode"));
    options.animatedTiles.setValue(data.$get("animatedTiles"));
    options.forceTouch.setValue(data.$get("forceTouch"));
  }

  @Override
  public void onGameLoad(Map<String, Integer> data) {
    data.$put("fogEnabled", options.fogEnabled.value);
    data.$put("daysOfPeace", options.daysOfPeace.value);
    data.$put("weatherMinDays", options.weatherMinDays.value);
    data.$put("weatherRandomDays", options.weatherRandomDays.value);
    data.$put("round_dayLimit", options.round_dayLimit.value);
    data.$put("noUnitsLeftLoose", options.noUnitsLeftLoose.value);
    data.$put("autoSupplyAtTurnStart", options.autoSupplyAtTurnStart.value);
    data.$put("unitLimit", options.unitLimit.value);
    data.$put("captureLimit", options.captureLimit.value);
    data.$put("timer_turnTimeLimit", options.timer_turnTimeLimit.value);
    data.$put("timer_gameTimeLimit", options.timer_gameTimeLimit.value);
    data.$put("co_getStarCost", options.co_getStarCost.value);
    data.$put("co_getStarCostIncrease", options.co_getStarCostIncrease.value);
    data.$put("co_getStarCostIncreaseSteps", options.co_getStarCostIncreaseSteps.value);
    data.$put("co_enabledCoPower", options.co_enabledCoPower.value);
  }

  @Override
  public void onGameSave(Map<String, Integer> data) {
    options.fogEnabled.setValue(data.$get("fogEnabled"));
    options.daysOfPeace.setValue(data.$get("daysOfPeace"));
    options.weatherMinDays.setValue(data.$get("weatherMinDays"));
    options.weatherRandomDays.setValue(data.$get("weatherRandomDays"));
    options.round_dayLimit.setValue(data.$get("round_dayLimit"));
    options.noUnitsLeftLoose.setValue(data.$get("noUnitsLeftLoose"));
    options.autoSupplyAtTurnStart.setValue(data.$get("autoSupplyAtTurnStart"));
    options.unitLimit.setValue(data.$get("unitLimit"));
    options.captureLimit.setValue(data.$get("captureLimit"));
    options.timer_turnTimeLimit.setValue(data.$get("timer_turnTimeLimit"));
    options.timer_gameTimeLimit.setValue(data.$get("timer_gameTimeLimit"));
    options.co_getStarCost.setValue(data.$get("co_getStarCost"));
    options.co_getStarCostIncrease.setValue(data.$get("co_getStarCostIncrease"));
    options.co_getStarCostIncreaseSteps.setValue(data.$get("co_getStarCostIncreaseSteps"));
    options.co_enabledCoPower.setValue(data.$get("co_enabledCoPower"));
  }

}
