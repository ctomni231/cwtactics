"use strict";

var constants = require("../constants");
var assert = require("../system/functions").assert;
var model = require("../model");
var move = require("../logic/move");

//
// Returns true if the unit with id tid is a transporter, else false.
//
exports.isTransportUnit = function (unit) {
  if (constants.DEBUG) assert(unit instanceof model.Unit);
  return (unit.type.maxloads > 0);
};

//
// Has a transporter unit with id tid loaded units? Returns true
// if yes, else false.
//
exports.hasLoads = function (unit) {
  if (constants.DEBUG) assert(unit instanceof model.Unit);

  for (var i = 0, e = model.units.length; i < e; i++) {
    if (unit.loadedIn === model.units[i]) {
      return true;
    }
  }

  return false;
};

//
// Returns true if a transporter with id tid can load the unit with the id lid.
// This function also calculates the resulting weight if the transporter would
// load the unit. If the calculated weight is greater than the maximum loadable
// weight false will be returned.
//
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

//
// Loads the unit with id lid into a transporter with the id tid.
//
// @param {cwt.Unit} transporter
// @param {cwt.Unit} load
//
exports.load = function (transporter, load) {
  if (constants.DEBUG) {
    assert(transporter instanceof model.Unit);
    assert(load instanceof model.Unit);
    assert(exports.isTransportUnit(transporter));
  }

  load.loadedIn = transporter;
};

//
// Unloads the unit with id lid from a transporter with the id tid.
//
exports.unload = function (transport, trsx, trsy, load, tx, ty) {
  if (constants.DEBUG) assert(load.loadedIn === transport);

  // TODO: remove this later
  // trapped ?
  if (tx === -1 || ty === -1 || model.mapData[tx][ty].unit) {
    controller.stateMachine.data.breakMultiStep = true;
    return;
  }

  // remove transport link
  load.loadedIn = null;

  // extract mode code id
  var moveCode;
  if (tx < trsx) moveCode = move.MOVE_CODES_LEFT;
  else if (tx > trsx) moveCode = move.MOVE_CODES_RIGHT;
  else if (ty < trsy) moveCode = move.MOVE_CODES_UP;
  else if (ty > trsy) moveCode = move.MOVE_CODES_DOWN;

  // move load out of the transporter
  move.movePathCache.clear();
  move.movePathCache.push(moveCode);
  move.move(unit, trsx, trsy, move.movePathCache, true, true, false);

  transport.canAct = false;
  load.canAct = false;
};

//
// Returns true if a transporter unit can unload one of it's loads at a given position.
// This functions understands the given pos as possible position for the transporter.
//
// @param {cwt.Unit} transporter
// @param x
// @param y
// @return {*}
//
exports.canUnloadSomethingAt = function (transporter, x, y) {
  var pid = transporter.owner;
  var unit;

  if (constants.DEBUG) assert(exports.isTransportUnit(transporter));
  for (var i = 0, e = model.units.length; i < e; i++) {

    unit = model.units[i];
    if (unit.loadedIn === transporter) {
      var moveType = unit.type.movetype;

      if (move.canTypeMoveTo(moveType, x - 1, y)) return true;
      if (move.canTypeMoveTo(moveType, x + 1, y)) return true;
      if (move.canTypeMoveTo(moveType, x, y - 1)) return true;
      if (move.canTypeMoveTo(moveType, x, y + 1)) return true;
    }
  }

  return false;
};
