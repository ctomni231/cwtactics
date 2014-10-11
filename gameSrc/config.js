"use strict";

var constants = require("constants");

/**
 * Configuration object which contains a configurable value.
 *
 * @param {Number} min
 * @param {Number} max
 * @param {Number} defaultValue
 * @param {Number?} step
 * @constructor
 */
exports.Config = function (min, max, defaultValue, step) {
  this.min = min;
  this.max = max;
  this.def = defaultValue;
  this.step = (step !== void 0) ? step : 1;
  this.resetValue();
};

exports.Config.prototype = {

  /**
   * Sets the value.
   *
   * @param {Number} value
   */
  setValue: function (value) {

    // check value bounds
    if (value < this.min) value = this.min;
    if (value > this.max) value = this.max;

    // check steps
    if ((value - this.min) % this.step !== 0) {
      throw Error("StepCriteriaBrokenException");
    }

    this.value = value;
  },

  /**
   * Decreases the value by one step.
   */
  decreaseValue: function () {
    this.setValue(this.value - this.step);
  },

  /**
   * Increases the value by one step.
   */
  increaseValue: function () {
    this.setValue(this.value + this.step);
  },

  /**
   * Resets the value of the parameter back to the default value.
   */
  resetValue: function () {
    this.value = this.def;
  }
};

var options = {

  // game configs
  "fogEnabled": new exports.Config(0, 1, 1),
  "daysOfPeace": new exports.Config(0, 50, 0),
  "weatherMinDays": new exports.Config(1, 5, 1),
  "weatherRandomDays": new exports.Config(0, 5, 4),
  "round_dayLimit": new exports.Config(0, 999, 0),
  "noUnitsLeftLoose": new exports.Config(0, 1, 0),
  "autoSupplyAtTurnStart": new exports.Config(0, 1, 1),
  "unitLimit": new exports.Config(0, constants.MAX_UNITS, 0, 5),
  "captureLimit": new exports.Config(0, constants.MAX_PROPERTIES, 0),
  "timer_turnTimeLimit": new exports.Config(0, 60, 0, 1),
  "timer_gameTimeLimit": new exports.Config(0, 99999, 0, 5),
  "co_getStarCost": new exports.Config(100, 50000, 9000, 100),
  "co_getStarCostIncrease": new exports.Config(0, 50000, 1800, 100),
  "co_getStarCostIncreaseSteps": new exports.Config(0, 50, 10),
  "co_enabledCoPower": new exports.Config(0, 1, 1),

  // app configs
  "fastClickMode": new exports.Config(0, 1, 0),
  "forceTouch": new exports.Config(0, 1, 0),
  "animatedTiles": new exports.Config(0, 1, 1)
};

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