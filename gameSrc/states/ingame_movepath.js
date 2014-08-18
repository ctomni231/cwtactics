"use strict";

var stateData = require("../dataTransfer/states");
var move = require("../logic/move");
var model = require("../model");
var renderer = require("../renderer");

var cfgFastClick = require("../config").getConfig("fastClickMode");

var setMovepathTarget = function () {
  var x = stateData.cursorX;
  var y = stateData.cursorY;

  // selected tile is not in the selection -> ignore action
  if (stateData.selection.getValue(x, y) < 0) {
    return;
  }

  var ox = stateData.target.x;
  var oy = stateData.target.y;
  var dis = model.getDistance(ox, oy, x, y);

  stateData.target.set(x, y);

  if (dis === 1) {

    // Try to add the cursor move as code to the move path
    move.addCodeToMovePath(
      move.codeFromAtoB(ox, oy, x, y),
      stateData.movePath,
      stateData.selection,
      stateData.source.x,
      stateData.source.y
    );

  } else {

    // Generate a complete new path because between the old tile and the new tile is at least another one tile
    move.generateMovePath(
      stateData.source.x,
      stateData.source.y,
      x,
      y,
      stateData.selection,
      stateData.movePath
    );
  }

  // TODO render new path
  renderer.layerEffects.clearAll();
  renderer.renderMovePath();
  renderer.layerEffects.renderLayer(0);
}


exports.state = {
  id: "INGAME_MOVEPATH",

  enter: function () {

    // when we do back steps in the game flow then we don't want to recreate an already created move way
    if (stateData.preventMovePathGeneration) {
      stateData.preventMovePathGeneration = false;
      return;
    }

    var breakMove = false;

    if (model.isTurnOwnerObject(stateData.source.unit) && stateData.source.unit.canAct) {

      // prepare move map and clean way
      stateData.movePath.clear();

      move.fillMoveMap(
        stateData.source,
        stateData.selection,
        stateData.source.x,
        stateData.source.y,
        stateData.source.unit
      );

      // go directly into action menu when the unit cannot move
      if (!stateData.selection.hasActiveNeighbour(stateData.source.x, stateData.source.y)) {
        breakMove = true;
      }
    } else {
      breakMove = true;
    }

    if (breakMove) {
      this.changeState("INGAME_MENU");
    } else {
      // TODO iiiih :(
      renderer.renderScreen();
    }
  },

  exit: function () {
    renderer.layerEffects.clear();
    renderer.layerFocus.clearAll();
  },

  inputMove: function (x, y) {
    var ox = stateData.cursorX;
    var oy = stateData.cursorY;

    stateData.setCursorPosition( renderer.convertToTilePos(x), renderer.convertToTilePos(y), true);

    var nx = stateData.cursorX;
    var ny = stateData.cursorY;
    if (ox != nx || oy || ny) setMovepathTarget();
  },

  UP: function () {
    stateData.moveCursor(move.MOVE_CODES_UP);
    setMovepathTarget();
  },

  DOWN: function () {
    stateData.moveCursor(move.MOVE_CODES_DOWN);
    setMovepathTarget();
  },

  LEFT: function () {
    stateData.moveCursor(move.MOVE_CODES_LEFT);
    setMovepathTarget();
  },

  RIGHT: function () {
    stateData.moveCursor(move.MOVE_CODES_RIGHT);
    setMovepathTarget();
  },

  ACTION: function () {
    var x = stateData.cursorX;
    var y = stateData.cursorY;
    var ox = stateData.target.x;
    var oy = stateData.target.y;
    var dis = model.getDistance(ox, oy, x, y);

    if (dis === 0 || cfgFastClick.value === 1) {
      this.changeState("INGAME_MENU");
    }
  },

  CANCEL: function () {
    this.changeState("INGAME_IDLE");
  }
};