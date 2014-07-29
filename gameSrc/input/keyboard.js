"use strict";

var constants = require('../constants');
var input = require('../input');

var CONSOLE_TOGGLE_KEY = 192;

var MAPPING = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  ACTION: 13,
  CANCEL: 8
};

var KEY_HANDLER = function (ev) {
  var key = constants.INACTIVE;

  if (input.wantsGgenericInput()) {
    if (cwt.Gameflow.activeState.mode != 0) {
      return;
    }
       // TODO
    cwt.Gameflow.activeState.genericInput(ev.keyCode);

  } else {

    // extract code
    switch (ev.keyCode) {

      case CONSOLE_TOGGLE_KEY:
        console.toggle();
        break;

      case MAPPING.LEFT:
        key = input.TYPE_LEFT;
        break;

      case MAPPING.UP:
        key = input.TYPE_UP;
        break;

      case MAPPING.RIGHT:
        key = input.TYPE_RIGHT;
        break;

      case MAPPING.DOWN:
        key = input.TYPE_DOWN;
        break;

      case MAPPING.CANCEL:
        key = input.TYPE_CANCEL;
        break;

      case MAPPING.ACTION:
        key = input.TYPE_ACTION;
        break;
    }

    // push key into input stack
    if (key !== constants.INACTIVE) {
      input.pushAction(key, constants.INACTIVE, constants.INACTIVE);
    }
  }
};

exports.backend = new input.InputBackend(
  MAPPING,
  function () {
    document.onkeydown = KEY_HANDLER;
  },
  function () {
    document.onkeydown = null;
  }
);
