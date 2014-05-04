/**
 *
 * @class
 */
cwt.Input = {

  MAPPING_STORAGE_KEY: "__user_key_map__",

  // all input command types
  TYPE_LEFT: 1,
  TYPE_RIGHT: 2,
  TYPE_UP: 3,
  TYPE_DOWN: 4,
  TYPE_ACTION: 5,
  TYPE_CANCEL: 6,
  TYPE_HOVER: 7,
  TYPE_SET_INPUT: 8,

  /**
   * @type cwt.RingBuffer<cwt.InputData>
   */
  stack: new cwt.RingBuffer(10),

  /**
   * @type cwt.RingBuffer<cwt.InputData>
   */
  pool: new cwt.RingBuffer(10),

  types: {},

  /**
   * If true, then every user input will be blocked.
   */
  blocked: false,

  initialize: function () {
    delete cwt.Input.initialize;

    Object.keys(cwt.Input.types).forEach(function (inp) {
      cwt.Input.types[inp].factory();
    });

    // create data holder
    while (!this.pool.isFull()) {
      this.pool.push(new cwt.InputData());
    }

    cwt.Input.initialized = true;
  },

  /**
   *
   */
  requestBlock: function () {
    this.blocked = true;
  },

  /**
   *
   */
  releaseBlock: function () {
    this.blocked = false;
  },

  genericInput: false,

  /**
   * Creates an input object. The factory function will be called directly after creating
   * the instance. Furthermore the created object will be inserted into cwt.Input as property
   * with the name given by the 'key' argument.
   *
   * @param key
   * @param factory
   */
  create: function (key, factory) {
    var obj = {};
    obj.factory = factory;
    this.types[key] = obj;
  },

  /**
   * Pushes an input key into the input stack. The parameters d1 and d2 has to be integers.
   *
   * @param {number} key
   * @param {number=} d1
   * @param {number=} d2
   */
  pushAction: function (key, d1, d2) {
    if (this.blocked || this.pool.isEmpty()) {
      return;
    }

    // convert undefined and null data arguments to the inactive code
    if (d1 !== 0 && !d1) {
      d1 = cwt.INACTIVE;
    }
    if (d2 !== 0 && !d2) {
      d2 = cwt.INACTIVE;
    }

    // push command into buffer
    var cmd = this.pool.pop();
    cmd.d1 = d1;
    cmd.d2 = d2;
    cmd.key = key;

    this.stack.push(cmd);
  },

  /**
   * Grabs an input key from the input stack. -1 if no key is in the stack.
   *
   * @returns {null|cwt.InputData}
   */
  popAction: function () {
    if (this.stack.isEmpty()) {
      return null;
    }
    return this.stack.pop();
  },

  /**
   * Saves the current active input mapping into the user storage.
   */
  saveKeyMapping: function () {
    cwt.Storage.generalStorage.set(
      this.MAPPING_STORAGE_KEY,
      // extract custom mapping
      {
        keyboard: this.types.keyboard.MAPPING,
        gamePad: this.types.gamePad.MAPPING
      },
      function () {
        if (cwt.DEBUG) {
          console.log("successfully saved user input mapping");
        }
      }
    );
  },

  /**
   * Loads the keyboard input mapping from the user storage. If no
   * user input setting will be found then the default mapping will
   * be used.
   *
   * @param cb
   */
  loadKeyMapping: function (cb) {
    cwt.Storage.generalStorage.get(
      this.MAPPING_STORAGE_KEY,
      function (obj) {
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
  },

  /**
   *
   * @param charCode
   * @return {String|null} Returns a string that represents the given keycode.
   */
  codeToChar: function (charCode) {
    if (charCode === -1) {
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
  }
};