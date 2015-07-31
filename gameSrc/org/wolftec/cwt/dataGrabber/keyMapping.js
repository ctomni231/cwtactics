"use strict";

var inpKeyboard = require("../input/keyboard");
var inpGamepad = require("../input/gamepad");
var constants = require("../constants");
var storage = require("../storage");

var MAPPING_STORAGE_KEY = "__KEY_MAPPING__";

// Saves the current active input mapping into the user storage.
//
exports.save = function () {
  storage.set(
    MAPPING_STORAGE_KEY,

    // extract custom mapping
    {
      keyboard: inpKeyboard.MAPPING,
      gamePad: inpGamepad.MAPPING
    },

    function() {
      if (constants.DEBUG) console.log("successfully saved user input mapping");
    }
  );
};

// Loads the keyboard input mapping from the user storage. If no
// user input setting will be found then the default mapping will
// be used.
//
exports.load = function (cb) {
  storage.get(
    MAPPING_STORAGE_KEY,

    function(obj) {
      if (obj && obj.value) {
        if (constants.DEBUG) console.log("loading custom key configuration");

        // inject custom mapping
        if (obj.value.keyboard) inpKeyboard.MAPPING = obj.value.keyboard;
        if (obj.value.gamePad) inpGamepad.MAPPING = obj.value.gamePad;
      }

      // call callback
      if (cb) {
        cb(obj != null);
      }
    }
  );
};