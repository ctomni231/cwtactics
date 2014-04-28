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
            console.log("loading custom key configuration");
          }

          // inject custom mapping
          cwt.Input.types.keyboard.MAPPING = obj.keyboard;
          cwt.Input.types.gamePad.MAPPING = obj.gamePad;
        }

        // call callback
        if (cb) {
          cb(obj != null);
        }
      }
    );
  }
};