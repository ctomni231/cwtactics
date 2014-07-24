var storage = require("./storage");

// Saves the current active input mapping into the user storage.
//
exports.save = function () {
  "use strict";

  storage.set(
    this.MAPPING_STORAGE_KEY,

    // extract custom mapping
    {
      keyboard: cwt.Input.types.keyboard.MAPPING,
      gamePad: cwt.Input.types.gamePad.MAPPING
    },

    function() {
      if (cwt.DEBUG) {
        console.log("successfully saved user input mapping");
      }
    }
  );
};

// Loads the keyboard input mapping from the user storage. If no
// user input setting will be found then the default mapping will
// be used.
//
exports.load = function (cb) {
  "use strict";

  storage.get(
    this.MAPPING_STORAGE_KEY,

    function(obj) {
      if (obj && obj.value) {
        if (cwt.DEBUG) {
          console.log("loading custom key configuration");
        }

        // inject custom mapping
        if (obj.value.keyboard) {
          cwt.Input.types.keyboard.MAPPING = obj.value.keyboard;
        }

        if (obj.value.gamePad) {
          cwt.Input.types.gamePad.MAPPING = obj.value.gamePad;
        }
      }

      // call callback
      if (cb) {
        cb(obj != null);
      }
    }
  );
};