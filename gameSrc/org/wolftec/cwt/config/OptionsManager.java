package org.wolftec.cwt.config;

import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.config.ConfigurableValue;
import org.wolftec.cwt.core.config.ConfigurationProvider;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.util.JsUtil;

public abstract class OptionsManager implements Injectable, ConfigurationProvider {

  public final ConfigurableValue fogEnabled;
  public final ConfigurableValue daysOfPeace;
  public final ConfigurableValue weatherMinDays;
  public final ConfigurableValue weatherRandomDays;
  public final ConfigurableValue round_dayLimit;
  public final ConfigurableValue noUnitsLeftLoose;
  public final ConfigurableValue autoSupplyAtTurnStart;
  public final ConfigurableValue unitLimit;
  public final ConfigurableValue captureLimit;
  public final ConfigurableValue timer_turnTimeLimit;
  public final ConfigurableValue timer_gameTimeLimit;
  public final ConfigurableValue co_getStarCost;
  public final ConfigurableValue co_getStarCostIncrease;
  public final ConfigurableValue co_getStarCostIncreaseSteps;
  public final ConfigurableValue co_enabledCoPower;

  public final ConfigurableValue fastClickMode;
  public final ConfigurableValue forceTouch;
  public final ConfigurableValue animatedTiles;

  public OptionsManager() {
    fogEnabled = new ConfigurableValue(0, 1, 1);
    daysOfPeace = new ConfigurableValue(0, 50, 0);
    weatherMinDays = new ConfigurableValue(1, 5, 1);
    weatherRandomDays = new ConfigurableValue(0, 5, 4);
    round_dayLimit = new ConfigurableValue(0, 999, 0);
    noUnitsLeftLoose = new ConfigurableValue(0, 1, 0);
    autoSupplyAtTurnStart = new ConfigurableValue(0, 1, 1);
    unitLimit = new ConfigurableValue(0, Constants.MAX_UNITS, 0, 5);
    captureLimit = new ConfigurableValue(0, Constants.MAX_PROPERTIES, 0);
    timer_turnTimeLimit = new ConfigurableValue(0, 60, 0, 1);
    timer_gameTimeLimit = new ConfigurableValue(0, 99999, 0, 5);
    co_getStarCost = new ConfigurableValue(100, 50000, 9000, 100);
    co_getStarCostIncrease = new ConfigurableValue(0, 50000, 1800, 100);
    co_getStarCostIncreaseSteps = new ConfigurableValue(0, 50, 10);
    co_enabledCoPower = new ConfigurableValue(0, 1, 1);
    fastClickMode = new ConfigurableValue(0, 1, 0);
    forceTouch = new ConfigurableValue(0, 1, 0);
    animatedTiles = new ConfigurableValue(0, 1, 1);
  }

  /**
   * Resets all registered configuration objects to their default value.
   */
  public void resetOptions() {
    JsUtil.forEachMapValue((Map<String, Object>) ((Object) this), (key, cfg) -> {
      if (cfg instanceof ConfigurableValue) {
        ((ConfigurableValue) cfg).resetValue();
      }
    });
  }
}
