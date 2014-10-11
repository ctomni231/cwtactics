"use strict";

var debug = require("../debug");

var move = require("../logic/move");
var model = require("../model");
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
    debug.logInfo("prepare new move way");

    // check that a move command cannot invoked when a move command is already in progress
    if (y !== constants.INACTIVE && x !== constants.INACTIVE && uid !== constants.INACTIVE) {
      throw new Error("IllegalStateException");
    }

    moveBuffer.clear();
    uid = unitId;
    x = unitX;
    y = unitY;
  }
};

exports.actionAppend = {
  invoke: function () {
    var i, e;
    for (i = 0, e = arguments.length; i < e; i++) {
      if (arguments[i] !== constants.INACTIVE) {
        debug.logInfo("append move command " + arguments[i]);
        moveBuffer.push(arguments[i]);
      }
    }
  }
};

exports.actionEnd = {
  invoke: function (preventOldPosUpd, preventNewPosUpd) {
    debug.logInfo("doing move from given move path");

    move.move(model.getUnit(uid), x, y, moveBuffer, false, preventOldPosUpd, preventNewPosUpd);

    statemachine.changeState("ANIMATION_MOVE");
    moveState.prepareMove(uid, x, y, moveBuffer);

    // reset variables
    uid = constants.INACTIVE;
    x = constants.INACTIVE;
    y = constants.INACTIVE;
  }
};
