"use strict";

var assert = require("./system/functions").assert;
var constants = require("constants");

exports.Config = function(min, max, defaultValue, step) {
  this.min = min;
  this.max = max;
  this.def = defaultValue;
  this.step = (step !== void 0) ? step : 1;
  this.resetValue();
};

exports.Config.prototype = {

  // Sets the value.
  //
  setValue: function(value) {

    // check_ bounds
    if (value < this.min) value = this.min;
    if (value > this.max) value = this.max;

    // check_ steps
    if ((value - this.min) % this.step !== 0) {
      assert(false, "step criteria is broken");
    }

    this.value = value;
  },

  // Decreases the value by one step.
  //
  decreaseValue: function() {
    this.setValue(this.value - this.step);
  },

  // Increases the value by one step.
  //
  increaseValue: function() {
    this.setValue(this.value + this.step);
  },

  //
  // Resets the value of the parameter back to the default value.
  //
  resetValue: function() {
    this.value = this.def;
  }
};

exports.gameConfigNames = [
  "co_getStarCostIncreaseSteps",
  "co_getStarCostIncrease",
  "autoSupplyAtTurnStart",
  "timer_turnTimeLimit",
  "timer_gameTimeLimit",
  "co_enabledCoPower",
  "weatherRandomDays",
  "noUnitsLeftLoose",
  "weatherMinDays",
  "round_dayLimit",
  "co_getStarCost",
  "captureLimit",
  "daysOfPeace",
  "fogEnabled",
  "unitLimit"
];

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

//
//
exports.getValue = function(name) {
  var cfg = options[name];
  return (cfg ? cfg.value : null);
};

//
//
exports.getConfig = function(name) {
  return options[name];
};

//
//
exports.resetValues = function() {
  Object.keys(options).forEach(function(cfg) {
    options[cfg].resetValue();
  });
};