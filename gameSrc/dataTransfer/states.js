// Shared data that will be used between the states.
//

var move = require("../logic/move");
var model = require("../model");
var cursorRenderer = require("../renderer/cursor");

//
// X coordinate of the cursor.
//
exports.cursorX = 0;

  //
  // Y coordinate of the cursor.
  //
exports.cursorY = 0;

  //
  //
  //
exports.resetCursor = function () {
  this.x = 0;
  this.y = 0;
};

//
// Moves the cursor into a given direction.
//
// @param {number} dir
//
exports.moveCursor = function (dir) {
  var len = 1;
  var x = exports.cursorX;
  var y = exports.cursorY;

  switch (dir) {

    case move.MOVE_CODES_UP :
      y -= len;
      break;

    case move.MOVE_CODES_RIGHT :
      x += len;
      break;

    case move.MOVE_CODES_DOWN  :
      y += len;
      break;

    case move.MOVE_CODES_LEFT  :
      x -= len;
      break;
  }

  exports.setCursorPosition(x, y);
};

//
// Moves the cursor to a given position. The view will be moved as well with
// this function to make sure that the cursor is on the visible view.
//
exports.setCursorPosition = function (x, y, relativeToScreen) {
  if (relativeToScreen) {
    x = x + cwt.Screen.offsetX;
    y = y + cwt.Screen.offsetY;
  }

  // change illegal positions to prevent out of bounds
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x >= model.mapWidth) x = model.mapWidth - 1;
  if (y >= model.mapHeight) y = model.mapHeight - 1;

  if (x === this.x && y === this.y) {
    return;
  }

  cursorRenderer.eraseCursor();

  this.x = x;
  this.y = y;

  // convert to screen relative pos
  x = x - cwt.Screen.offsetX;
  y = y - cwt.Screen.offsetY;

  // do possible screen shift
  var moveCode = cwt.INACTIVE;
  if (x <= 3) {
    moveCode = move.MOVE_CODES_RIGHT;
    if (cwt.Screen.shiftScreen(moveCode)) {
      cwt.MapRenderer.shiftMap(moveCode);
    }

  }

  // do possible screen shift
  if (x >= cwt.SCREEN_WIDTH - 3) {
    moveCode = move.MOVE_CODES_LEFT;
    if (cwt.Screen.shiftScreen(moveCode)) {
      cwt.MapRenderer.shiftMap(moveCode);
    }
  }

  // do possible screen shift
  if (y <= 3) {
    moveCode = move.MOVE_CODES_DOWN;
    if (cwt.Screen.shiftScreen(moveCode)) {
      cwt.MapRenderer.shiftMap(moveCode);
    }

  }

  // do possible screen shift
  if (y >= cwt.SCREEN_HEIGHT - 3) {
    moveCode = move.MOVE_CODES_UP;
    if (cwt.Screen.shiftScreen(moveCode)) {
      cwt.MapRenderer.shiftMap(moveCode);
    }
  }

  cursorRenderer.renderCursor();
};

exports.fromIngameToOptions = false;