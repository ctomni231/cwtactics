/**
 * Base package of the game.
 *
 * @module
 */
window.cwt = {

  /**
   * Name of the font that will be used to render text.
   *
   * @constant
   */
  GAME_FONT: "Gamefont",

  /**
   * URL of the active server where the game was downloaded from. This server will be used to grab the
   * game data.
   *
   * @constant
   */
  MOD_PATH: "http://localhost:8000/",
  // MOD_PATH: "http://192.168.1.30:8000/",

  /**
   * Tile size base.
   *
   * @constant
   */
  TILE_BASE: 16,

  /**
   * Represents a numeric code which means no data.
   *
   * @constant
   */
  INACTIVE: -1,

  /**
   * Represents a numeric code which means no data.
   *
   * @constant
   */
  DESELECT_ID: -2,

  /** @constant */
  NOT_AVAILABLE: -2,

  /**
   * Determines the debug mode. Can be changed at runtime to enable/disable runtime assertions and
   * debug outputs.
   */
  DEBUG: true,

  /**
   * Screen width in tiles.
   *
   * @constant
   */
  SCREEN_WIDTH: 32,

  /**
   * Screen height in tiles.
   *
   * @constant
   */
  SCREEN_HEIGHT: 24,

  /**
   * Maximum width of a map.
   *
   * @constant
   */
  MAX_MAP_WIDTH: 60,

  /**
   * Maximum height of a map.
   *
   * @constant
   */
  MAX_MAP_HEIGHT: 40,

  /**
   * Maximum range of a move action.
   *
   * @constant
   */
  MAX_MOVE_LENGTH: 15,

  /**
   * The game won't cache data when this variable is set to true.
   *
   * @constant
   */
  DEV_NO_CACHE: false,

  /**
   * Special static function that contains an empty body. This object can be used when a property with type function
   * should be disabled without having to modify other code that calls it.
   */
  emptyFunction: function () {
  },

  /**
   * Creates a function that calls every function of a module in the cwt namespace which name is equal to the
   * given event name.
   *
   * @param {String} eventName
   * @return {Function}
   */
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

  /**
   * Asserts that `expr` is true. If `expr` is false then an Error will be thrown.
   *
   * @param {Boolean} expr
   * @param {String?} msgA
   */
  assert: function (expr, msgA) {
    if (!expr) {
      if (typeof msgA === "undefined") {
        msgA = "FAIL";
      }

      if (console.error) {
        console.error(msgA);
      }

      // raise error
      throw msgA;
    }
  },

  /**
   * Calls a function lazy. This means the factory function fn will be called when the curried function (return
   * value) will be called the first time. The factory function needs to return the value that should be returned
   * by the curried function in future.
   *
   * @param {Function} fn factory function
   * @return {Function} curried function which returns the returned value of the factory function
   */
  lazy: function (fn) {
    var value = undefined;
    return function () {
      if (value === undefined) {
        value = fn();
      }

      return value;
    }
  },

  repeat: function (n, f) {
    for (var i = 0; i < n; i++) {
      f.call(this, i);
    }
    return this;
  }
};

/* Registers generic error listener. */
window.onerror = function (e, file, line, column, errorObj) {
  if (cwt.Error) {
    // cwt.Error("Critical Game Fault","ERR_UNKNOWN");
  }
  console.error(e, (arguments.length > 0) ? file + " line:" + line : null);
};