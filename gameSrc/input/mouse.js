"use strict";

var constants = require('../constants');
var state = require('../statemachine');
var input = require('../input');

var canvas = document.getElementById("canvas_layer6");
var sx = 1.0;
var sy = 1.0;

var MOUSE_UP_EVENT = function (ev) {
  var key = constants.INACTIVE;

  // click on canvas while menu is open -> cancel always
  ev = ev || window.event;
  switch (ev.which) {

    // LEFT
    case 1:
      key = input.TYPE_ACTION;
      break;

    // MIDDLE
    case 2:
      break;

    // RIGHT
    case 3:
      key = input.TYPE_CANCEL;
      break;
  }

  // push command into the stack
  if (key !== constants.INACTIVE) input.pushAction(key, constants.INACTIVE, constants.INACTIVE);
};

var MOUSE_MOVE_EVENT = function (ev) {
  var id = ev.target.id;

  var x, y;

  // extract real x,y position on the canvas
  ev = ev || window.event;
  if (typeof ev.offsetX === 'number') {
    x = ev.offsetX;
    y = ev.offsetY;
  }
  else {
    x = ev.layerX;
    y = ev.layerY;
  }

  var cw = canvas.width;
  var ch = canvas.height;

  // get the scale based on actual width;
  sx = cw / canvas.offsetWidth;
  sy = ch / canvas.offsetHeight;

  var data = state.activeState.data;
  if (data.inputMove) data.inputMove(parseInt(x*sx),parseInt(y*sy));

  // convert to a tile position
  /*
   x = cwt.Screen.offsetX + parseInt(x / cwt.Screen.TILE_BASE, 10);
   y = cwt.Screen.offsetY + parseInt(y / cwt.Screen.TILE_BASE, 10);

   if (x !== cwt.Cursor.x || y !== cwt.Cursor.y) {
   cwt.Input.pushAction(cwt.Input.TYPE_HOVER, x, y);
   }
   */
};

exports.backend = new input.InputBackend(
  null,
  function () {
    if (constants.DEBUG) console.log("enable mouse");

    canvas.onmousemove = MOUSE_MOVE_EVENT;
    canvas.onmouseup = MOUSE_UP_EVENT;
  },
  function () {
    canvas.onmousemove = null;
    canvas.onmouseup = null;
  }
);
