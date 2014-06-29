"use strict";

// Defines the base package of the whole game here.
// Everything part of the game will be defined as property
// of this object. Normally the stuff of the game should
// be defined as module in this root object.
//
// Example for a module function:
// 
// > cwt.MyModule = { 
// >   a:function() { ... } 
// > };
// >
// > cwt.MyModule.a();
// 
window.cwt = {

  // **GAME_FONT (const)** 
  // 
  // Name of the font that will be used to render text.
  //
  GAME_FONT: "Gamefont",

  // **MOD_PATH (const)** 
  // 
  // URL of the active server where the game was downloaded from. 
  // This server will be used to grab the game data.
  //
  MOD_PATH: "http://localhost:8000/",
  /* MOD_PATH: "http://192.168.1.30:8000/", */

  // **TILE_BASE (const)** 
  // 
  // The size of a tile on the screen. Every screen interaction will
  // use that value to handle input mechanics and rendering. The graphic
  // must be in the same size.
  // 
  TILE_BASE: 16,

  // **INACTIVE (const)** 
  // 
  // Represents a numeric code which means no data.
  // 
  INACTIVE: -1,

  // **DESELECT_ID (const)** 
  // 
  // Represents a numeric code which means no data.
  // 
  DESELECT_ID: -2,

  // **NOT_AVAILABLE (const)** 
  // 
  NOT_AVAILABLE: -2,

  // **DEBUG: bool** 
  //
  // Determines the debug mode. Can be changed at runtime to 
  // enable/disable runtime assertions and debug outputs.
  //
  DEBUG: true,

  // **SCREEN_WIDTH (const)** 
  // 
  // Screen width in tiles. The screen contains always only this given number 
  // of tiles in a row. If the screen is smaller or bigger than the tile base 
  // multiplized with this value, then the game screen will be scaled to fit 
  // the device screen.
  // 
  SCREEN_WIDTH: 32,

  // **SCREEN_HEIGHT (const)** 
  // 
  // Screen height in tiles.
  // 
  // The screen contains always only this given number of tiles in a column.
  // If the screen is smaller or bigger than the tile base multiplized with 
  // this value, then the game screen will be scaled to fit the device screen.
  // 
  SCREEN_HEIGHT: 24,

  // **MAX_MAP_WIDTH (const)** 
  // 
  // Maximum width of a map.
  //
  MAX_MAP_WIDTH: 60,

  // **MAX_MAP_HEIGHT (const)** 
  // 
  // Maximum height of a map.
  //
  MAX_MAP_HEIGHT: 40,

  // **MAX_MOVE_LENGTH (const)** 
  // 
  // Maximum range of a move action.
  // 
  MAX_MOVE_LENGTH: 15,

  // **DEV_NO_CACHE (const)** 
  // 
  // The game won't cache data when this variable is set to true.
  // 
  DEV_NO_CACHE: false,

  // **emptyFunction (const)** 
  // 
  // Special static property that contains a fucntion with an empty body. 
  // This object can be used when a property with type function should be
  // disabled without having to modify other code that calls it.
  // 
  emptyFunction: function () {
  },

  // **doFunction(function): any** 
  //
  // This function imediatly calls the given argument 
  // *fn* and returns the result of *fn* to the caller of this function. It 
  // realize the following javascript pattern:
  //
  // > var my = (function(){
  // >   return ...;
  // > })();
  //   
  // With this function you can produce the same as above with the following
  // call:
  //
  // > var my = cwt.doFunction(function(){
  // >   return ...;
  // > });
  // 
  doFunction: function (fn) {
    return fn();
  },

  // **createModuleCaller(string): function** 
  // 
  // Creates a function that calls every function of a module in the cwt 
  // namespace which name is equal to the given event name.
  // 
  createModuleCaller: function (eventName) {
    return function () {
      for (var prop in cwt) {
        var module = cwt[prop];
        if (module[eventName]) {
          module[eventName].apply(module, arguments);
        }
      }
    };
  },

  // **assert(bool, string?)** 
  // 
  // Asserts that *expr* is true. If *expr* is false then an Error will be thrown.
  //
  assert: function (expr, msgA) {
    if (!expr) {
      if (typeof msgA === "undefined") {
        msgA = "FAIL";
      }

      if (console.error) {
        console.error(msgA);
      }

      throw msgA;
    }
  },

  // **lazy(function): any** 
  // 
  // Calls a function lazy. This means the factory function 
  // *fn* will be called when the curried function *(returned value)* will be 
  // called the first time. The factory function needs to return the value
  // that should be returned by the curried function in future.
  // 
  lazy: function (fn) {
    var value = undefined;
    return function () {
      if (value === undefined) {
        value = fn();
      }

      return value;
    }
  },

  // **repeat(int, function): window.cwt** 
  // 
  // Repeats the given function *f* *n* times and returns the *cwt* object.
  // 
  repeat: function (n, f) {
    for (var i = 0; i < n; i++) {
      f.call(this, i);
    }
    return this;
  },

  // **selectRandomListElement(array, any?): any** 
  //
  // Selects a random element from the given *list*. It's possible
  // to ship an argument *notWanted* which represents an element of *list* that 
  // will not selected randomly.
  //
  selectRandomListElement: function (list, notWanted) {
    var el;

    do {
      var index = parseInt(Math.random() * list.length, 10);
      el = list[index];
    }
    while (el === notWanted);

    return el;
  }
};

// Registers a generic error listener which works in browser environments.
// 
window.onerror = function (e, file, line, column, errorObj) {
  if (cwt.Error) {
    /* cwt.Error("Critical Game Fault","ERR_UNKNOWN"); */
  }

  console.error(e, (arguments.length > 0) ? file + " line:" + line : null);
};

// **Class CircularBuffer** 
// 
// An implementation of the concept of a circular buffer.
// Internally a circular buffer has a fixed size that makes the whole 
// object very memory constant.
//
cwt.CircularBuffer = my.Class({

  // **CircularBuffer(int?):** 
  //
  // You can set *size* to set the maximum size of the buffer *(default is 32)*
  //
  constructor: function (size) {
    if (arguments.length === 0) {
      size = 32;
    } else if (size <= 0) {
      throw Error("size cannot be 0 or lower");
    }

    this.index = 0;
    this.size = 0;
    this.data = [];
    this.maxSize = size;
  },

  // **CircularBuffer.isEmpty(): bool**
  // 
  // true when no entries are in the buffer, else false
  // 
  isEmpty: function () {
    return this.size === 0;
  },

  // **CircularBuffer.isFull(): bool**
  // 
  // true when buffer is full, else false
  // 
  isFull: function () {
    return this.size === this.maxSize;
  },

  /**
   * Returns an element at a given index. The element won't be returned.
   *
   * @param {number} index
   * @return {T}
   */
  get: function (index) {
    if (index < 0 || index >= this.size) {
      throw Error("illegal index");
    }

    return this.data[(this.index + index) % this.maxSize];
  },

  /**
   * Returns the oldest object from the buffer. The element will be removed from the buffer.
   *
   * @return {T} oldest object in the buffer
   */
  popFirst: function () {
    if (this.size === 0) {
      throw Error("buffer is empty");
    }

    var obj = this.data[this.index];

    // remove entry to prevent memory leaks
    this.data[this.index] = null;

    this.size--;
    this.index++;
    if (this.index === this.maxSize) {
      this.index = 0;
    }

    return obj;
  },

  /**
   * Returns the youngest object from the buffer. The element will be removed from the buffer.
   *
   * @return {T} youngest object in the buffer
   */
  popLast: function () {
    if (this.size === 0) {
      throw Error("buffer is empty");
    }

    var index = (this.index + this.size - 1) % this.maxSize;
    var obj = this.data[index];

    // remove entry to prevent memory leaks
    this.data[index] = null;
    this.size--;

    return obj;
  },

  /**
   *
   * @param index
   * @param el
   * @return {T}
   */
  set: function (index, el) {
    if (index < 0 || index >= this.size) {
      throw Error("illegal index");
    }

    this.data[(this.index + index) % this.maxSize] = el;
  },

  /**
   * Pushes an object into the buffer.
   *
   * @param {T} el object that will be pushed into the buffer
   */
  push: function (el) {
    if (this.size === this.maxSize) {
      throw Error("buffer is full");
    }

    this.data[(this.index + this.size) % this.maxSize] = el;
    this.size++;
  },

  /**
   * Removes everything from the buffer. After that the buffer will be empty.
   */
  clear: function () {
    this.index = 0;
    this.size = 0;

    // remove references from list to prevent memory leaks
    for (var i = 0, e = this.data.length; i < e; i++) {
      this.data[i] = null;
    }
  }
});

/**
 * Class that contains a static algorithm to register and return instances by a key. This class implements the multiton
 * pattern by a string based identifier. Usable by inheritance.
 *
 * @template T
 */
cwt.IdMultiton = {

  /**
   * @return {Array} Names that are registered in the multiton.
   */
  getInstanceKeyList: function () {
    return this.classNames_;
  },

  /**
   *
   * @param obj
   * @return {string}
   */
  getInstanceKey: function (obj) {
    if (cwt.DEBUG) cwt.assert(!!this.classInstances_);
    if (cwt.DEBUG) cwt.assert(obj instanceof this);

    for (var i = 0, e = this.classNames_.length; i < e; i++) {
      if (this.classInstances_[this.classNames_[i]] === obj) {
        return this.classNames_[i];
      }
    }

    return null;
  },

  /**
   *
   * @param obj
   * @return {number}
   */
  getInstanceId: function (obj) {
    if (cwt.DEBUG) cwt.assert(!!this.classInstances_);
    if (cwt.DEBUG) cwt.assert(obj instanceof this);

    for (var i = 0, e = this.classNames_.length; i < e; i++) {
      if (this.classInstances_[this.classNames_[i]] === obj) {
        return i;
      }
    }

    return null;
  },

  /**
   *
   * @param {string} key
   * @param obj
   */
  registerInstance: function (key, obj) {
    if (cwt.DEBUG) cwt.assert(obj instanceof this);

    if (!this.classInstances_) {
      this.classInstances_ = {};
      this.classNames_ = [];
    }

    if (cwt.DEBUG) cwt.assert(this.MULTITON_NAMES.indexOf(key) != -1);
    if (cwt.DEBUG) cwt.assert(!this.classInstances_.hasOwnProperty(key));

    this.classInstances_[key] = obj;
    this.classNames_.push(key);
  },

  /**
   * Returns an instance of the IdMultiton.
   *
   * @param {String} key
   * @return {T}
   */
  getInstance: function (key) {

    var obj = this.classInstances_[key];

    // create instance
    if (!obj) {
      throw Error("key " + key + " is not registered in the id multiton");
    }

    return obj;
  },

  /**
   * Returns an instance of the IdMultiton.
   *
   * @param {number} id
   * @return {T}
   */
  getInstanceById: function (id) {

    var key = this.classNames_[id];

    if (cwt.DEBUG) cwt.assert(key);

    var obj = this.classInstances_[key];

    // create instance
    if (!obj) {
      throw Error("key " + key + " is not registered in the id multiton");
    }

    return obj;
  }
};

/**
 * Usable as super class to enable other classes to be used as
 * Multiton which allows to grab instances with Class.getInstance(id).
 * If the instance with the given id does not exists, then it will be
 * created.
 *
 * @template T
 */
cwt.IndexMultiton = {

  /**
   * Gets the id of a multiton object. This object must be an instance of this class.
   *
   * @param obj
   * @return {*}
   */
  getInstanceId: function (obj) {
    if (cwt.DEBUG) cwt.assert(!!this.classInstances_);
    if (cwt.DEBUG) cwt.assert(obj instanceof this);

    for (var i = 0, e = this.classInstances_.length; i < e; i++) {
      if (this.classInstances_[i] === obj) return i;
    }

    return cwt.INACTIVE;
  },

  /**
   * Returns an instance of the IndexMultiton.
   *
   * @param {Number} id
   * @param {Boolean=} nullReturn (optional)
   * @return {T}
   */
  getInstance: function (id, nullReturn) {
    if (typeof id !== "number" || id < 0 || id >= this.MULTITON_INSTANCES) {
      throw Error("illegal id");
    }

    if (this.classInstances_ == void 0) {
      this.classInstances_ = [];

      // prevent array holes
      for (var i = 0, e = this.MULTITON_INSTANCES; i < e; i++) {
        this.classInstances_[i] = null;
      }

    }

    var l = this.classInstances_;
    if (!l[id]) {

      // allow null as result for some calls (like turn start actions
      // checks all units -> we won't want to create all units then)
      if (nullReturn) return null;

      if (cwt.DEBUG) {
        console.log("creating instance for with id " + id);
      }

      l[id] = new this();

      /* invoke creation event */
      if (this.onInstanceCreation) {
        this.onInstanceCreation(id, l[id]);
      }
    }

    return l[id];
  }
};

/**
 *
 * @class
 */
cwt.Matrix = my.Class({

  constructor: function (w, h, defaultValue) {
    if (defaultValue === undefined) {
      defaultValue = null;
    }

    this.data = [];
    this.defValue = defaultValue;
    this.width = w;
    this.height = h;

    // CREATE SUB ARRAYS
    for (var i = 0; i < w; i++) {
      this.data[i] = [];
    }

    this.resetValues();
  },

  /**
   *
   */
  resetValues: function () {
    var defValue = this.defValue;
    var w = this.width;
    var h = this.height;
    var isFN = typeof defValue === 'function';

    // COMPLEX ARRAY (MATRIX) OBJECT
    for (var i = 0, e = w; i < e; i++) {
      for (var j = 0, ej = h; j < ej; j++) {
        if (isFN) this.data[i][j] = defValue(i, j, this.data[i][j]);
        else       this.data[i][j] = defValue;
      }
    }
  },

  /**
   *
   * @param {cwt.Matrix} matrix
   */
  clone: function (matrix) {
    var w = this.width;
    var h = this.height;
    if (matrix.data.length !== this.data.length) throw Error();

    // COMPLEX ARRAY (MATRIX) OBJECT
    for (var i = 0, e = w; i < e; i++) {
      for (var j = 0, ej = h; j < ej; j++) {
        matrix.data[i][j] = this.data[i][j];
      }
    }
  }
});

/**
 * @class
 */
cwt.Config = my.Class(/** @lends cwt.Config.prototype */ {

  STATIC: /** @lends cwt.Config */ {

    MULTITON_NAMES: [
      "weatherMinDays",
      "weatherRandomDays",
      "round_dayLimit",
      "noUnitsLeftLoose",
      "autoSupplyAtTurnStart",
      "unitLimit",
      "captureLimit",
      "timer_turnTimeLimit",
      "timer_gameTimeLimit",
      "co_getStarCost",
      "co_getStarCostIncrease",
      "co_getStarCostIncreaseSteps",
      "co_enabledCoPower",
      "daysOfPeace",
      "fogEnabled"
    ],

    /**
     *
     */
    resetAll: function () {
      for (var i = this.MULTITON_NAMES.length - 1; i >= 0; i--) {
        this.getInstance(this.MULTITON_NAMES[i]).resetValue();
      }
    },

    /**
     *
     * @param {String} name
     * @param {Number} min
     * @param {Number} max
     * @param {Number} defaultValue
     * @param {Number=} step
     */
    create: function (name, min, max, defaultValue, step) {
      cwt.Config.registerInstance(name, new cwt.Config(min, max, defaultValue, step));
    },

    /**
     * Returns the actual configuration value of a given configuration
     * key.
     *
     * @param {String} name
     */
    getValue: function (name) {
      return this.getInstance(name).value;
    },

    /**
     * Returns the actual configuration object of a given configuration
     * key.
     *
     * @param {String} name
     */
    getConfig: function (name) {
      return this.getInstance(name);
    },

    $onSaveGame: function (data) {
      data.cfg = {};
      for (var i = 0, e = this.MULTITON_NAMES.length; i < e; i++) {
        var key = this.MULTITON_NAMES[i];
        data.cfg[key] = cwt.Config.getValue(key);
      }
    },

    $onLoadGame: function (data, isSave) {
      cwt.Config.resetAll();
      if (isSave && data.cfg) {
        for (var i = 0, e = this.MULTITON_NAMES.length; i < e; i++) {
          var key = this.MULTITON_NAMES[i];
          if (data.cfg[key]) {
            cwt.Config.getConfig(key).setValue(data.cfg[key]);
          }
        }
      }
    }
  },

  /**
   * @param {Number} min
   * @param {Number} max
   * @param {Number} defaultValue
   * @param {Number=} step (default is 1)
   */
  constructor: function (min, max, defaultValue, step) {
    this.min = min;
    this.max = max;
    this.def = defaultValue;
    this.step = (step !== void 0) ? step : 1;
    this.resetValue();
  },

  /**
   *
   * @param {Number} value
   */
  setValue: function (value) {

    // check_ bounds
    if (value < this.min) value = this.min;
    if (value > this.max) value = this.max;

    // check_ steps
    if ((value - this.min) % this.step !== 0) {
      cwt.assert(false, "step criteria is broken");
    }

    this.value = value;
  },

  decreaseValue: function () {
    this.setValue(this.value - this.step);
  },

  increaseValue: function () {
    this.setValue(this.value + this.step);
  },

  /**
   * Resets the value of the parameter back to the default
   * value.
   */
  resetValue: function () {
    this.value = this.def;
  }

});
my.extendClass(cwt.Config, { STATIC: cwt.IdMultiton });

/**
 *
 * @class
 */
cwt.GameState = my.Class({
  constructor: function (enterFn, exitFn, updateFn, renderFn, data) {

    // data
    this.data = data;

    // handler
    this.exit = exitFn;
    this.enter = enterFn;
    this.update = updateFn;
    this.render = renderFn;
  }
});

/**
 * @interface
 * @template T
 */
cwt.InterfaceMenu = {

  /**
   * @return {number}
   */
  getSelectedIndex: cwt.emptyFunction,

  /**
   * @function
   * @param {number?} index
   * @return {T}
   */
  getContent: cwt.emptyFunction,

  /**
   * @function
   * @param {number?} index
   * @return {*}
   */
  isEnabled: cwt.emptyFunction,

  /**
   * @function
   * @return {number} number of entries in the menu
   */
  getSize: cwt.emptyFunction,

  /**
   *
   * @function
   */
  clean: cwt.emptyFunction,

  /**
   *
   * @function
   * @param {T} content
   * @param {boolean?} enabled
   */
  addEntry: cwt.emptyFunction
};

/**
 * @interface
 */
cwt.InterfaceSelection = {

  /**
   *
   * @function
   * @return {Array.<Array<number>>}
   */
  getData: cwt.emptyFunction,

  /**
   *
   * @function
   * @return {number}
   */
  getCenterY: cwt.emptyFunction,

  /**
   *
   * @function
   * @return {number}
   */
  getCenterX: cwt.emptyFunction,

  /**
   *
   * @function
   * @param {number} x
   * @param {number} y
   * @param {number} defValue
   */
  setCenter: cwt.emptyFunction,

  /**
   *
   * @function
   * @param {number} x
   * @param {number} y
   */
  getValue: cwt.emptyFunction,

  /**
   *
   * @function
   * @param {number} x
   * @param {number} y
   * @param {number} value
   */
  setValue: cwt.emptyFunction
};

/**
 *
 * @class
 */
cwt.Layer = my.Class(/** @lends cwt.Layer.prototype */ {

  constructor: function (config) {
    this.canvas = null;
    this.frames = [];
    this.ctx = [];
    this.cFrame = 0;
    this.cTime = 0;
    this.frameLimit = config.time;

    this.drawAll = null;
    this.draw = null;

    // create canvas objects
    var n = 0;
    while (n < frames) {
      this.canvas[n] = document.createElement("canvas");
      this.ctx[n] = this.canvas[n].getContext("2d");
      n++;
    }
  },

  renderFrame: function (frame) {
    var curCanvas = this.frames[frame];
    this.canvas.getContext("2d").drawImage(curCanvas, 0, 0, curCanvas.width, curCanvas.height);
  },

  /**
   * Hides a layer.
   */
  hide: function () {
    this.canvas.style.display = "none";
  },

  /**
   * Shows a layer.
   */
  show: function () {
    this.canvas.style.display = "block";
  },

  /**
   * Returns the current active canvas of the layer.
   *
   * @return {HTMLCanvasElement}
   */
  getActiveFrame: function () {
    return this.canvas[this.cFrame];
  },

  /**
   * Returns the rendering context for a given frame id.
   *
   * @param {number=} frame
   * @return {CanvasRenderingContext2D}
   */
  getContext: function (frame) {
    if (arguments.length === 0) {
      frame = 0;
    }

    if (this.DEBUG) cwt.assert(frame >= 0 && frame < this.canvas.length);

    return this.ctx[frame];
  },

  /**
   * Updates the internal timer of the layer.
   *
   * @param delta
   */
  update: function (delta) {
    this.cTime += delta;

    // increase frame
    if (this.cTime >= this.frameLimit) {
      this.cTime = 0;
      this.cFrame++;

      // reset frame
      if (this.cFrame === this.canvas.length) {
        this.cFrame = 0;
      }
    }
  },

  /**
   * Resets timer and frame counter.
   */
  resetTimer: function () {
    this.cTime = 0;
    this.cFrame = 0;
  }

});

/**
 *
 * @class
 */
cwt.LayeredCanvas = my.Class({

  constructor: function (canvasId, frames, w, h) {

    // root canvas
    this.cv = document.getElementById(canvasId);
    this.cv.width = w;
    this.cv.height = h;
    this.ctx = this.cv.getContext("2d");
    this.w = w;
    this.h = h;

    // cached layers
    if (frames > 0) {
      this.contexts = [];
      this.layers = [];

      var n = 0;
      while (n < frames) {
        var cv = document.createElement("canvas");

        cv.width = w;
        cv.height = h;

        this.contexts[n] = cv.getContext("2d");
        this.layers[n] = cv;

        n++;
      }
    }
  },

  /**
   *
   * @param {Number} index
   */
  renderLayer: function (index) {
    if (cwt.DEBUG) cwt.assert(arguments.length === 0 || (index >= 0 && index < this.layers.length));

    var ctx = this.getContext();
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.drawImage(this.getLayer(index), 0, 0, this.w, this.h);
  },

  /**
   *
   * @param {Number?} index
   * @return {HTMLCanvasElement}
   */
  getLayer: function (index) {
    if (cwt.DEBUG) cwt.assert(index === void 0 || (index >= 0 && index < this.layers.length));

    // root ?
    if (index === void 0) {
      return this.cv;
    }

    return this.layers[index];
  },

  /**
   *
   * @param {Number?} index
   */
  clear: function (index) {
    this.getContext(index).clearRect(0, 0, this.w, this.h);
  },

  /**
   * Clears all background layers and the front layer.
   */
  clearAll: function () {
    var n = this.layers.length - 1;
    while (n >= 0) {
      this.clear(n);
      n--;
    }
  },

  /**
   *
   * @param {Number?} index
   * @return {CanvasRenderingContext2D}
   */
  getContext: function (index) {
    if (cwt.DEBUG) cwt.assert(index === void 0 || (index >= 0 && index < this.layers.length));

    // root ?
    if (index === void 0) {
      return this.ctx;
    }

    return this.contexts[index];
  }
});

/**
 * @class
 */
cwt.Pagination = my.Class(/** @lends cwt.Pagination.prototype */ {

  constructor: function (list, pageSize, updateFn) {
    this.page = 0;
    this.list = list;
    this.entries = [];
    while (pageSize > 0) {
      this.entries.push(null);
      pageSize--;
    }
    this.updateFn = updateFn;
  },

  /**
   *
   * @param index
   */
  selectPage: function (index) {
    var PAGE_SIZE = this.entries.length;

    if (index < 0 || index * PAGE_SIZE >= this.list.length) {
      return;
    }

    this.page = index;

    index = (index * PAGE_SIZE);
    for (var n = 0; n < PAGE_SIZE; n++) {
      this.entries[n] = (index + n >= this.list.length) ? null : this.list[index + n];
    }

    if (this.updateFn) {
      this.updateFn();
    }
  }

});

/**
 *
 */
cwt.SheetDatabase = my.Class({

  /**
   * Registers a sheet in the database.
   */
  registerSheet: function (sheet) {

    // validate it
    cwt.assert(!this.validator_.validate("constr", sheet));

    // add it
    this.sheets[sheet.ID] = sheet;
    this.types.push(sheet.ID);

    if (this.check_) {
      this.check_(sheet);
    }
  },

  /**
   *
   * @param sheet
   * @return {boolean}
   */
  isValidSheet: function (sheet) {
    for (var i = 0, e = this.types.length; i < e; i++) {
      if (this.sheets[this.types[i]] === sheet) return true;
    }

    return false;
  },

  constructor: function (impl) {
    cwt.assert(impl);

    /**
     *
     * @type {jjv}
     */
    this.validator_ = new jjv();

    /**
     * Holds all type sheet objects.
     *
     * @type {Object}
     */
    this.sheets = {};

    /**
     * Holds all type names.
     *
     * @type {Array}
     */
    this.types = [];

    /**
     *
     * @type {afterCheck}
     */
    this.check_ = impl.afterCheck;

    // register schema
    this.validator_.addSchema("constr", impl.schema);

    // add id check
    var that = this;
    this.validator_.addCheck('isID', function (v, p) {
      if (p) {
        return !that.sheets.hasOwnProperty(v);
      } else {
        return true;
      }
    });

    // add custom checks
    if (impl.checks) {
      for (var key in impl.checks) {
        if (impl.checks.hasOwnProperty(key)) {
          this.validator_.addCheck(key, impl.checks[key]);
        }
      }
    }
  }
});
