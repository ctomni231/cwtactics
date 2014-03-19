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
   * @type cwt.RingBuffer
   */
  stack: new cwt.RingBuffer(10, function (i, obj) {
    if (!obj) {
      return new cwt.InputData();
    } else return obj;
  }),

  /**
   * If true, then every user input will be blocked.
   */
  blocked: false,

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

  /**
   * Pushes an input key into the input stack. The parameters d1 and d2 has to be integers.
   *
   * @param {number} key
   * @param {number=} d1
   * @param {number=} d2
   */
  pushAction: function (key, d1, d2) {
    if (this.blocked) {
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
  },

  /**
   * Grabs an input key from the input stack. -1 if no key is in the stack.
   *
   * @returns {null|cwt.InputData}
   */
  popAction: function () {

    // grab value
    var ri = controller.input_stack_r_;
    var value = controller.input_stack[controller.input_stack_r_];
    if (value === cwt.INACTIVE) return false;

    controller.input_stack[ri] = cwt.INACTIVE;

    var d1 = controller.input_data1[ri];
    var d2 = controller.input_data2[ri];

    // eval value
    var keys = controller.DEFAULT_KEY_MAP.KEYBOARD;
    var keysM = controller.DEFAULT_KEY_MAP.MOUSE;
    var event = null;
    switch (value) {

      case keys.UP:
        event = (d1 > 1) ? "SHIFT_UP" : "INP_UP";
        break;
      case keys.DOWN:
        event = (d1 > 1) ? "SHIFT_DOWN" : "INP_DOWN";
        break;
      case keys.LEFT:
        event = (d1 > 1) ? "SHIFT_LEFT" : "INP_LEFT";
        break;
      case keys.RIGHT:
        event = (d1 > 1) ? "SHIFT_RIGHT" : "INP_RIGHT";
        break;
      case keys.ACTION:
        event = "INP_ACTION";
        break;
      case keys.CANCEL:
        event = "INP_CANCEL";
        break;
      case keysM.HOVER:
        event = "INP_HOVER";
        break;

      default:
        cwt.assert("false");
        return false;
    }

    if (d1 !== cwt.INACTIVE && d2 !== cwt.INACTIVE) {
      cwt.Gameflow.event(event, d1, d2);
    } else cwt.Gameflow.event(event);

    // increase read index
    ri++;
    if (ri === controller.input_stack.length) ri = 0;
    controller.input_stack_r_ = ri;

    return true;
  },

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
    factory.call(obj);
    this[key] = obj;
  },

  /**
   * Saves the current active input mapping into the user storage.
   */
  saveKeyMapping: function () {
    cwt.Storage.generalStorage.set(
      this.MAPPING_STORAGE_KEY,
      // extract custom mapping
      {
        keyboard: this.keyboard.MAPPING,
        gamePad: this.gamePad.MAPPING
      },
      function () {
        if (cwt.DEBUG) {
          cwt.log("successfully saved user input mapping");
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
        if (obj) {
          if (cwt.DEBUG) {
            cwt.log("loading custom key configuration");
          }

          // inject custom mapping
          this.keyboard.MAPPING = obj.keyboard;
          this.gamePad.MAPPING = obj.gamePad;
        }

        // call callback
        if (cb) {
          cb(obj != null);
        }
      }
    );
  }
};