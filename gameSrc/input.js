"use strict";

var circBuff = require("./circularBuffer");
var constants = require("./constants");
var assert = require("./functions").assert;

// all input command types
exports.TYPE_LEFT = 1;
exports.TYPE_RIGHT = 2;
exports.TYPE_UP = 3;
exports.TYPE_DOWN = 4;
exports.TYPE_ACTION = 5;
exports.TYPE_CANCEL = 6;
exports.TYPE_HOVER = 7;
exports.TYPE_SET_INPUT = 8;

//
// Represents a given data set of an input call.
//
exports.InputData = my.Class({
  constructor: function () {
    this.reset();
  },

  //
  // Resets the object data to a fresh state (no saved information).
  //
  reset: function () {
    this.key = constants.INACTIVE;
    this.d1 = constants.INACTIVE;
    this.d2 = constants.INACTIVE;
  }
});

exports.InputBackend = my.Class({
  constructor: function (mapping, enableFn, disableFn) {
    assert(typeof enableFn === "function" && typeof disableFn === "function");

    this.enable = enableFn;
    this.disable = enableFn;
    this.mapping = mapping;
  }
});

var stack = new circBuff.CircularBuffer(10);

var pool = circBuff.createBufferByClass(exports.InputData, 10);

// If true, then every user input will be blocked.
//
var blocked = false;

var genericInput = false;

// Returns **true** when the input system wants a generic input (raw codes) from input backends like
// keyboards and game pads.
//
exports.wantsGgenericInput = function() {
  return genericInput;
}

// Requests an input block. All further input calls will be dropped after calling this.
//
exports.requestBlock = function () {
  blocked = true;
};

// Releases an input block. Input calls will be registered in the game machine after calling this.
//
exports.releaseBlock = function () {
  blocked = false;
};

// Creates an input object. The **factory** function will be called directly after creating
// the instance. Furthermore the created object will be inserted into cwt.Input as property
// with the name given by the **key** argument.
//
exports.registerInputHandler = function (key, factory) {
  if (constants.DEBUG) assert(key && !types[key]);

  var obj = {};
  obj.factory = factory;
  types[key] = obj;
};

// Pushes an input **key** into the input stack. The parameters **d1** and **d2** has to be integers.
//
exports.pushAction = function (key, d1, d2) {
  if (blocked || pool.isEmpty()) {
    return;
  }

  // convert undefined and null data arguments to the inactive code
  if (d1 !== 0 && !d1) {
    d1 = constants.INACTIVE;
  }
  if (d2 !== 0 && !d2) {
    d2 = constants.INACTIVE;
  }

  // push command into buffer
  var cmd = pool.popFirst();
  cmd.d1 = d1;
  cmd.d2 = d2;
  cmd.key = key;

  stack.push(cmd);
};

// Grabs and returns an **input data object** from the input stack, **null** if the stack is empty.
//
exports.popAction = function () {
  if (stack.isEmpty()) {
    return null;
  }
  return stack.popFirst();
};

exports.releaseAction = function (inp) {
  pool.push(inp);
};

// Returns the character for a key code.
//
exports.codeToChar = function (charCode) {
  if (charCode === constants.INACTIVE) {
    return null;
  }

  var value = String.fromCharCode(charCode);
  switch (charCode) {
    case 6:
      value = "Mac";
      break;
    case 8:
      value = "Backspace";
      break;
    case 9:
      value = "Tab";
      break;
    case 13:
      value = "Enter";
      break;
    case 16:
      value = "Shift";
      break;
    case 17:
      value = "CTRL";
      break;
    case 18:
      value = "ALT";
      break;
    case 19:
      value = "Pause/Break";
      break;
    case 20:
      value = "Caps Lock";
      break;
    case 27:
      value = "ESC";
      break;
    case 32:
      value = "Space";
      break;
    case 33:
      value = "Page Up";
      break;
    case 34:
      value = "Page Down";
      break;
    case 35:
      value = "End";
      break;
    case 36:
      value = "Home";
      break;
    case 37:
      value = "Arrow Left";
      break;
    case 38:
      value = "Arrow Up";
      break;
    case 39:
      value = "Arrow Right";
      break;
    case 40:
      value = "Arrow Down";
      break;
    case 43:
      value = "Plus";
      break;
    case 45:
      value = "Insert";
      break;
    case 46:
      value = "Delete";
      break;
    case 91:
      value = "Left Window Key";
      break;
    case 92:
      value = "Right Window Key";
      break;
    case 93:
      value = "Select Key";
      break;
    case 96:
      value = "Numpad 0";
      break;
    case 97:
      value = "Numpad 1";
      break;
    case 98:
      value = "Numpad 2";
      break;
    case 99:
      value = "Numpad 3";
      break;
    case 100:
      value = "Numpad 4";
      break;
    case 101:
      value = "Numpad 5";
      break;
    case 102:
      value = "Numpad 6";
      break;
    case 103:
      value = "Numpad 7";
      break;
    case 104:
      value = "Numpad 8";
      break;
    case 105:
      value = "Numpad 9";
      break;
    case 106:
      value = "*";
      break;
    case 107:
      value = "+";
      break;
    case 109:
      value = "-";
      break;
    case 110:
      value = ";";
      break;
    case 111:
      value = "/";
      break;
    case 112:
      value = "F1";
      break;
    case 113:
      value = "F2";
      break;
    case 114:
      value = "F3";
      break;
    case 115:
      value = "F4";
      break;
    case 116:
      value = "F5";
      break;
    case 117:
      value = "F6";
      break;
    case 118:
      value = "F7";
      break;
    case 119:
      value = "F8";
      break;
    case 120:
      value = "F9";
      break;
    case 121:
      value = "F10";
      break;
    case 122:
      value = "F11";
      break;
    case 123:
      value = "F12";
      break;
    case 144:
      value = "Num Lock";
      break;
    case 145:
      value = "Scroll Lock";
      break;
    case 186:
      value = ";";
      break;
    case 187:
      value = "=";
      break;
    case 188:
      value = ",";
      break;
    case 189:
      value = "-";
      break;
    case 190:
      value = ".";
      break;
    case 191:
      value = "/";
      break;
    case 192:
      value = "`";
      break;
    case 219:
      value = "[";
      break;
    case 220:
      value = "\\";
      break;
    case 221:
      value = "]";
      break;
    case 222:
      value = "'";
      break;
  }

  return value;
};