package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.game.log.Logger;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.cwt.game.persistence.StorageEntry;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;
import org.wolfTec.cwt.utility.beans.InjectedByFactory;
import org.wolfTec.cwt.utility.beans.PostInitialization;

@Bean public class GameConfigBean {

  @InjectedByFactory private Logger log;
  @Injected private StorageBean storage;

  private Map<String, Config> configs;
  private Array<String> configNames;

  @PostInitialization public void init() {
    configs = JSCollections.$map();
    configNames = JSCollections.$array();

    // game logic
    createConfig("fogEnabled", new Config(0, 1, 1, 1), true);
    createConfig("daysOfPeace", new Config(0, 50, 0, 1), true);
    createConfig("weatherMinDays", new Config(1, 5, 1, 1), true);
    createConfig("weatherRandomDays", new Config(0, 5, 4, 1), true);
    createConfig("round_dayLimit", new Config(0, 999, 0, 1), true);
    createConfig("noUnitsLeftLoose", new Config(0, 1, 0, 1), true);
    createConfig("autoSupplyAtTurnStart", new Config(0, 1, 1, 1), true);
    createConfig("unitLimit", new Config(0, Constants.MAX_UNITS, 0, 5), true);
    createConfig("captureLimit", new Config(0, Constants.MAX_PROPERTIES, 0, 1), true);
    createConfig("timer_turnTimeLimit", new Config(0, 60, 0, 1), true);
    createConfig("timer_gameTimeLimit", new Config(0, 99999, 0, 5), true);
    createConfig("co_getStarCost", new Config(100, 50000, 9000, 100), true);
    createConfig("co_getStarCostIncrease", new Config(0, 50000, 1800, 100), true);
    createConfig("co_getStarCostIncreaseSteps", new Config(0, 50, 10, 1), true);
    createConfig("co_enabledCoPower", new Config(0, 1, 1, 1), true);

    // app config
    createConfig("fastClickMode", new Config(0, 1, 0, 1), false);
    createConfig("forceTouch", new Config(0, 1, 0, 1), false);
    createConfig("animatedTiles", new Config(0, 1, 1, 1), false);
  }

  private void createConfig(String name, Config cfg, boolean gameConfig) {
    configs.$put(name, cfg);
    if (gameConfig) configNames.push(name);
  }

  public Array<String> getConfigNames() {
    return configNames;
  }

  public Config getConfig(String key) {
    return configs.$get(key);
  }

  public Integer getConfigValue(String key) {
    return configs.$get(key).getValue();
  }

  /**
   * Resets all config values, except the application config values, back to
   * their default value.
   */
  public void resetConfig() {
    for (int i = 0; i < configNames.$length(); i++) {
      getConfig(configNames.$get(i)).resetValue();
    }
  }

  public void loadConfiguration(Callback0 callback) {
    storage.get(Constants.STORAGE_PARAMETER_APPLICATION_CONFIG, (
        StorageEntry<Map<String, Integer>> entry) -> {
      if (entry.value != null) {
        getConfig("fastClickMode").setValue(entry.value.$get("fastClickMode"));
        getConfig("forceTouch").setValue(entry.value.$get("forceTouch"));
        getConfig("animatedTiles").setValue(entry.value.$get("animatedTiles"));
      }
    });
  }

  public void saveConfiguration(Callback0 callback) {
    Map<String, Integer> appConfigs = JSCollections.$map();
    appConfigs.$put("fastClickMode", getConfigValue("fastClickMode"));
    appConfigs.$put("forceTouch", getConfigValue("forceTouch"));
    appConfigs.$put("animatedTiles", getConfigValue("animatedTiles"));

    storage.set(Constants.STORAGE_PARAMETER_APPLICATION_CONFIG, appConfigs, (savedData, err) -> {
      if (err != null) {
        log.error("SavingApplicationConfigError");

      } else {
        callback.$invoke();
      }
    });
  }
}
