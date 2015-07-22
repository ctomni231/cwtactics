package org.wolftec.cwt;

public abstract class GameOptions {

  // game configs
  public static final Config fogEnabled;
  public static final Config daysOfPeace;
  public static final Config weatherMinDays;
  public static final Config weatherRandomDays;
  public static final Config round_dayLimit;
  public static final Config noUnitsLeftLoose;
  public static final Config autoSupplyAtTurnStart;
  public static final Config unitLimit;
  public static final Config captureLimit;
  public static final Config timer_turnTimeLimit;
  public static final Config timer_gameTimeLimit;
  public static final Config co_getStarCost;
  public static final Config co_getStarCostIncrease;
  public static final Config co_getStarCostIncreaseSteps;
  public static final Config co_enabledCoPower;

  // app configs
  public static final Config fastClickMode;
  public static final Config forceTouch;
  public static final Config animatedTiles;

  static {
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
 * List of registered configuration keys.
 *
 * @constant
 */
exports.gameConfigNames = Object.seal(Object.keys(options));

/**
 *
 * @param name
 * @return {Number}
 */
exports.getValue = function (name) {
  return exports.getConfig(name).value;
};

/**
 *
 * @param name
 * @return {exports.Config}
 */
exports.getConfig = function (name) {
  if (!options.hasOwnProperty(name)) {
    throw new Error("there is no configuration object with key '" + name + "'");
  }

  return options[name];
};

/**
 * Resets all registered configuration objects to their default value.
 */
exports.resetValues = function () {
  Object.keys(options).forEach(function (cfg) {
    options[cfg].resetValue();
  });
};
}
