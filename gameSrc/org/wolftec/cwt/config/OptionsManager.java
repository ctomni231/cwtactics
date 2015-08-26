package org.wolftec.cwt.config;

import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.core.ioc.Injectable;

public abstract class OptionsManager implements Injectable {

  public final Config fogEnabled;
  public final Config daysOfPeace;
  public final Config weatherMinDays;
  public final Config weatherRandomDays;
  public final Config round_dayLimit;
  public final Config noUnitsLeftLoose;
  public final Config autoSupplyAtTurnStart;
  public final Config unitLimit;
  public final Config captureLimit;
  public final Config timer_turnTimeLimit;
  public final Config timer_gameTimeLimit;
  public final Config co_getStarCost;
  public final Config co_getStarCostIncrease;
  public final Config co_getStarCostIncreaseSteps;
  public final Config co_enabledCoPower;

  public final Config fastClickMode;
  public final Config forceTouch;
  public final Config animatedTiles;

  public OptionsManager() {
    fogEnabled = new Config(0, 1, 1);
    daysOfPeace = new Config(0, 50, 0);
    weatherMinDays = new Config(1, 5, 1);
    weatherRandomDays = new Config(0, 5, 4);
    round_dayLimit = new Config(0, 999, 0);
    noUnitsLeftLoose = new Config(0, 1, 0);
    autoSupplyAtTurnStart = new Config(0, 1, 1);
    unitLimit = new Config(0, Constants.MAX_UNITS, 0, 5);
    captureLimit = new Config(0, Constants.MAX_PROPERTIES, 0);
    timer_turnTimeLimit = new Config(0, 60, 0, 1);
    timer_gameTimeLimit = new Config(0, 99999, 0, 5);
    co_getStarCost = new Config(100, 50000, 9000, 100);
    co_getStarCostIncrease = new Config(0, 50000, 1800, 100);
    co_getStarCostIncreaseSteps = new Config(0, 50, 10);
    co_enabledCoPower = new Config(0, 1, 1);
    fastClickMode = new Config(0, 1, 0);
    forceTouch = new Config(0, 1, 0);
    animatedTiles = new Config(0, 1, 1);
  }

  /**
   * Resets all registered configuration objects to their default value.
   */
  public void resetOptions() {
    JsUtil.forEachMapValue((Map<String, Object>) ((Object) this), (key, cfg) -> {
      if (cfg instanceof Config) {
        ((Config) cfg).resetValue();
      }
    });
  }
}
