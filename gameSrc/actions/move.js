"use strict";

var move = require("../logic/move");
var model = require("../model");
var assert = require("../system/functions").assert;
var constants = require("../constants");
var moveState = require("../states/ingame_anim_move");
var statemachine = require("../statemachine");
var CircularBuffer = require("../system/circularBuffer").CircularBuffer;

// cached variables
var uid = constants.INACTIVE;
var x = constants.INACTIVE;
var y = constants.INACTIVE;
var moveBuffer = new CircularBuffer(constants.MAX_SELECTION_RANGE);

exports.actionStart = {
  invoke: function (unitId, unitX, unitY) {
    if (constants.DEBUG) console.log("prepare new move path");

    // check that a move command cannot invoked when a move command is already in progress
    if (constants.DEBUG) assert(y === constants.INACTIVE && x === constants.INACTIVE && uid === constants.INACTIVE);

    moveBuffer.clear();
    uid = unitId;
    x = unitX;
    y = unitY;
  }
};

exports.actionAppend = {
  invoke: function () {
    for (var i = 0, e = arguments.length; i < e; i++) {
      if (arguments[i] !== constants.INACTIVE) {
        if (constants.DEBUG) console.log("append move command " + arguments[i]);

        moveBuffer.push(arguments[i]);
      }
    }
  }
};

exports.actionEnd = {
  invoke: function () {
    if (constants.DEBUG) console.log("doing move from given move path");

    move.move(model.units[uid], x, y, moveBuffer, false, false, false);

    statemachine.changeState("ANIMATION_MOVE");
    moveState.prepareMove(uid, x, y, moveBuffer);

    // reset variables
    uid = constants.INACTIVE;
    x = constants.INACTIVE;
    y = constants.INACTIVE;
  }
};
