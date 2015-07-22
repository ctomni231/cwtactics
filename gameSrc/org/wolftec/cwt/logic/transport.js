"use strict";

var constants = require("../constants");
var assert = require("../system/functions").assert;
var model = require("../model");
var move = require("../logic/move");
var sheets = require("../sheets");

/**
 * @param {Unit} unit
 * @return true if the unit with id tid is a transporter, else false.
 */
exports.isTransportUnit = function (unit) {
  if (constants.DEBUG) assert(unit instanceof model.Unit);
  return (unit.type.maxloads > 0);
};

/**
 * Has a transporter unit with id tid loaded units?
 *
 * @param {Unit} unit
 * @return {boolean} true if yes, else false.
 */
exports.hasLoads = function (unit) {
  if (constants.DEBUG) assert(unit instanceof model.Unit);

  for (var i = 0, e = model.units.length; i < e; i++) {
    if (unit.loadedIn === model.units[i]) {
      return true;
    }
  }

  return false;
};

/**
 * Returns true if a transporter with id tid can load the unit with the id lid.
 * This function also calculates the resulting weight if the transporter would
 * load the unit. If the calculated weight is greater than the maximum loadable
 * weight false will be returned.
 *
 * @param {Unit} transporter
 * @param {Unit} load
 * @return {boolean}
 */
exports.canLoadUnit = function (transporter, load) {
  if (constants.DEBUG) {
    assert(transporter instanceof model.Unit);
    assert(load instanceof model.Unit);
    assert(load !== transporter);
    assert(exports.isTransportUnit(transporter));
    assert(load.loadedIn !== transporter);
  }

  return (transporter.type.canload.indexOf(load.type.movetype) !== -1);
};

/**
 * Loads the unit with id lid into a transporter with the id tid.
 *
 * @param {Unit} transporter
 * @param {Unit} load
 */
exports.load = function (transporter, load) {
  if (load === transporter) throw new Error("LoadException: same unit");
  if (load.loadedIn) throw new Error("LoadException: unit already loaded");

  load.loadedIn = transporter;
};

/**
 * Unloads the unit with id lid from a transporter with the id tid.
 *
 * @param {Unit} transport
 * @param {Unit} load
 */
exports.unload = function (transporter, load) {
  if (load.loadedIn !== transporter) throw new Error("UnloadException: not in transporter");

  load.loadedIn = null;
};

/**
 * Returns true if a transporter unit can unload one of it's loads at a given position.
 * This functions understands the given pos as possible position for the transporter.
 *
 * @param {Unit} transporter
 * @param {Number} x
 * @param {Number} y
 * @return {boolean}
 */
exports.canUnloadSomethingAt = function (transporter, x, y) {
  var pid = transporter.owner;
  var unit;

  if (constants.DEBUG) assert(exports.isTransportUnit(transporter));
  for (var i = 0, e = model.units.length; i < e; i++) {

    unit = model.units[i];
    if (unit.loadedIn === transporter) {
      var moveType = sheets.getSheet(sheets.TYPE_MOVETYPE, unit.type.movetype);

      if (move.canTypeMoveTo(moveType, x - 1, y)) return true;
      if (move.canTypeMoveTo(moveType, x + 1, y)) return true;
      if (move.canTypeMoveTo(moveType, x, y - 1)) return true;
      if (move.canTypeMoveTo(moveType, x, y + 1)) return true;
    }
  }

  return false;
};
