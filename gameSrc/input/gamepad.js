"use strict";

var constants = require('../constants');
var emptyFunc = require('../functions').emptyFunction;
var input = require('../input');

var MAPPING = {
  ACTION: 0,
  CANCEL: 1
};

var prevTimestamps = [];

var UPDATER_FUNCTION = function () {
  var gamePads = navigator.webkitGetGamepads();

  for (var i = 0, e = 4; i < e; i++) {
    var gamePad = gamePads[i];
    if (!gamePad) continue;

    // check_ timestamp
    if (prevTimestamps[i] && (gamePad.timestamp == prevTimestamps[i])) continue;
    prevTimestamps[i] = gamePad.timestamp;

    // in key mapping
    if (input.wantsGgenericInput()) {
      if (cwt.Gameflow.activeState.mode != 1) {
        return;
      }

      var code = -1;

      // grab key code of the pressed button
      if (gamePad.elements[0] === 1) code = 0;
      else if (gamePad.elements[1] === 1) code = 1;
      else if (gamePad.elements[2] === 1) code = 2;
      else if (gamePad.elements[3] === 1) code = 3;
      else if (gamePad.elements[4] === 1) code = 4;
      else if (gamePad.elements[5] === 1) code = 5;
      else if (gamePad.elements[6] === 1) code = 6;
      else if (gamePad.elements[7] === 1) code = 7;
      else if (gamePad.elements[8] === 1) code = 8;
      else if (gamePad.elements[9] === 1) code = 9;
      else if (gamePad.elements[10] === 1) code = 10;
      else if (gamePad.elements[11] === 1) code = 11;
      else if (gamePad.elements[12] === 1) code = 12;
      else if (gamePad.elements[13] === 1) code = 13;

      if (code > -1) {
        cwt.Gameflow.activeState.genericInput(code);
      }
    } else {
      var key = null;

      // try to extract key
      if (gamePad.buttons[MAPPING.ACTION] === 1) {
        key = input.TYPE_ACTION;

      } else if (gamePad.buttons[MAPPING.CANCEL] === 1) {
        key = input.TYPE_CANCEL;

      } else if (gamePad.axes[1] < -0.5) {
        key = input.TYPE_UP;

      } else if (gamePad.axes[1] > +0.5) {
        key = input.TYPE_DOWN;

      } else if (gamePad.axes[0] < -0.5) {
        key = input.TYPE_LEFT;

      } else if (gamePad.axes[0] > +0.5) {
        key = input.TYPE_RIGHT;
      }

      // invoke input event when a known key was pressed
      if (key) {
        input.pushAction(key, constants.INACTIVE, constants.INACTIVE);
      }
    }
  }
};

exports.backend = new input.InputBackend(
  MAPPING,
  function () {
    exports.update = UPDATER_FUNCTION;
  },
  function () {
    exports.update = emptyFunc;
  }
);

exports.update = emptyFunc;