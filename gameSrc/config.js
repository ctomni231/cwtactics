"use strict";

var constants = require("./constants");
var debug = require("./debug");

var options = {

  // game configs
  "fogEnabled": new Config(0, 1, 1),
  "daysOfPeace": new Config(0, 50, 0),
  "weatherMinDays": new Config(1, 5, 1),
  "weatherRandomDays": new Config(0, 5, 4),
  "round_dayLimit": new Config(0, 999, 0),
  "noUnitsLeftLoose": new Config(0, 1, 0),
  "autoSupplyAtTurnStart": new Config(0, 1, 1),
  "unitLimit": new Config(0, constants.MAX_UNITS, 0, 5),
  "captureLimit": new Config(0, constants.MAX_PROPERTIES, 0),
  "timer_turnTimeLimit": new Config(0, 60, 0, 1),
  "timer_gameTimeLimit": new Config(0, 99999, 0, 5),
  "co_getStarCost": new Config(100, 50000, 9000, 100),
  "co_getStarCostIncrease": new Config(0, 50000, 1800, 100),
  "co_getStarCostIncreaseSteps": new Config(0, 50, 10),
  "co_enabledCoPower": new Config(0, 1, 1),

  // app configs
  "fastClickMode": new Config(0, 1, 0),
  "forceTouch": new Config(0, 1, 0),
  "animatedTiles": new Config(0, 1, 1)
};

/** Resets a config object. */
var resetConfigObject = function (id) {
  options[id].resetValue();
};

/** List of registered configuration keys. */
exports.gameConfigNames = Object.seal(Object.keys(options));

/** */
exports.getValue = function (name) {
  return exports.getConfig(name).value;
};

/** */
exports.getConfig = function (name) {
  if (!options.hasOwnProperty(name)) debug.logCritical("IdException: "+name+" is unknown");
  return options[name];
};

/** Resets all registered configuration objects to their default value. */
exports.resetValues = function () {
  exports.gameConfigNames.forEach(resetConfigObject);
};