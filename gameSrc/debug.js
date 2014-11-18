"use strict";

/**
 * This module is used to log debug information during the game runs. This module is only doing stuff when the DEBUG
 * parameter, which is located in the constants module, is enabled.
 *
 * @type {behaviorTree}
 * @module
 */

var errorState = require("./states/error");
var constants = require("./constants");
var renderer = require("./renderer");
var sheets = require("./sheets");
var states = require("./statemachine");
var model = require("./model");

var ASSERT_FAILED_DESC = "AssertionFailed";
var PATTERN_LOCATION = " (Location: {err})";
var ERR_REPLACE = /(\{err\})/gi;
var N_A = "N/A";

var action = null;
var tile = null;
var x = 0;
var y = 0;

/**
 * Asserts that a expression will be true.
 *
 * @param {boolean} expr
 * @param {String?} where
 */
exports.assertTrue = function(expr, where) {
  if (!expr) {
    exports.throwError(ASSERT_FAILED_DESC, where);
  }
};

/**
 *
 * @param  {string} errorMsg description of the error (e.g. NullPointerException)
 * @param  {string} where location where the error was thrown
 */
exports.throwError = function(errorMsg, where) {
  if (!where) where = N_A;

  // update action message for debug panel
  var msg = errorMsg + PATTERN_LOCATION.replace(ERR_REPLACE,where);
  exports.updateActionInformation(ERR + msg);
  exports.logCritical(msg);

  // go into error state
  states.changeState("ERROR_SCREEN");
  errorState.setErrorData(errorMsg, where);

  // raise a real javascript error
  throw new Error(errorMsg + " (Location: " + where + ")");
};

/**
 *
 *
 * @param  {string} currentAction [description]
 */
exports.updateActionInformation = function(currentAction) {
  action = currentAction;
};

/**
 *
 * @param  {number} cx [description]
 * @param  {number} cy [description]
 */
exports.updateCursorInformation = function(cx, cy) {
  x = cx;
  y = cy;

  tile = model.mapData[cx][cy].type.ID;
};

/**
 *
 * @param  {[type]} layer [description]
 */
exports.renderInformation = function(layer) {
  var ctx = layer.getContext(0);

  ctx.fillText("Pos (" + x + "," + y + ")", 0, 0);
  ctx.fillText("Doing => " + action, 0, 0);

  layer.renderLayer(0);
};