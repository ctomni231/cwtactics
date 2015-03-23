package org.wolftec.cwtactics.game.domain.managers;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.game.domain.config.Config;
import org.wolftec.cwtactics.game.domain.config.GameAppConfigData;
import org.wolftec.log.Logger;
import org.wolftec.persistence.DataTypeConverter;
import org.wolftec.persistence.VirtualFilesystemManager;

@ManagedComponent
public class GameConfigManager implements ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;

  private DataTypeConverter<GameAppConfigData> converter;

  @Injected
  private VirtualFilesystemManager fs;

  @ManagedConstruction
  private Map<String, Config> configs;

  @ManagedConstruction
  private Array<String> configNames;

  @Override
  public void onComponentConstruction(ComponentManager manager) {

    converter = new DataTypeConverter<GameAppConfigData>(GameAppConfigData.class);

    // game logic
    createConfig("fogEnabled", new Config(0, 1, 1, 1), true);
    createConfig("daysOfPeace", new Config(0, 50, 0, 1), true);
    createConfig("weatherMinDays", new Config(1, 5, 1, 1), true);
    createConfig("weatherRandomDays", new Config(0, 5, 4, 1), true);
    createConfig("round_dayLimit", new Config(0, 999, 0, 1), true);
    createConfig("noUnitsLeftLoose", new Config(0, 1, 0, 1), true);
    createConfig("autoSupplyAtTurnStart", new Config(0, 1, 1, 1), true);
    createConfig("unitLimit", new Config(0, EngineGlobals.MAX_UNITS, 0, 5), true);
    createConfig("captureLimit", new Config(0, EngineGlobals.MAX_PROPERTIES, 0, 1), true);
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

  /**
   * Loads the game configuration.
   * 
   * @param cb
   */
  public void loadData(Callback0 cb) {
    fs.readKey("config/user_data.json", converter, (err, entry) -> {
      GameAppConfigData config = entry.value;

      if (config != null) {
        log.info("Found user data... going to load it");

        getConfig("fastClickMode").setValue(config.fastClickMode ? 1 : 0);
        getConfig("forceTouch").setValue(config.forceTouch ? 1 : 0);
        getConfig("animatedTiles").setValue(config.animatedTiles ? 1 : 0);

      } else {
        log.info("No user data found... going use default data");
      }

      cb.$invoke();
    });
  }

  /**
   * Saves the game configuration.
   * 
   * @param callback
   */
  public void saveData(Callback0 callback) {
    GameAppConfigData config = new GameAppConfigData();
    config.forceTouch = (getConfigValue("forceTouch") == 1);
    config.fastClickMode = (getConfigValue("fastClickMode") == 1);
    config.animatedTiles = (getConfigValue("animatedTiles") == 1);

    fs.writeKey("config/user_data.json", converter, config, (err) -> {
      if (err != null) {
        log.warn("Could not write game configuration file");
      }

      callback.$invoke();
    });
  }
}
