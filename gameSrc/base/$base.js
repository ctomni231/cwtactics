/**
 * Base package of the game.
 *
 * @module
 */
window.cwt = {

  GAME_FONT: "Gamefont",

  MOD_PATH: "http://localhost:8000/",
  // MOD_PATH: "http://192.168.1.30:8000/",

  /**
   * Tile size base.
   *
   * @final
   */
  TILE_BASE: 16,

  /**
   * Number of tiles in a row in the screen.
   *
   * @final
   */
  MAX_TILES_W: 20,

  /**
   * Number of tiles in a column in the screen.
   *
   * @final
   */
  MAX_TILES_H: 15,

  /**
   * Represents a numeric code which means no data.
   *
   * @final
   */
  INACTIVE: -1,

  /** @final */
  DESELECT_ID: -2,

  /** @final */
  NOT_AVAILABLE: -2,

  /**
   * Determines the debug mode.
   */
  DEBUG: true,

  /**
   * Screen width in tiles.
   *
   * @final
   */
  SCREEN_WIDTH: 32,

  /**
   * Screen height in tiles.
   *
   * @final
   */
  SCREEN_HEIGHT: 24,

  /** @final */
  MAX_MAP_WIDTH: 60,

  /** @final */
  MAX_MAP_HEIGHT: 40,

  /** @final */
  MAX_MOVE_LENGTH: 15,

  /** @final */
  DEV_NO_CACHE: true,

  emptyFunction: function () {
  },

  createModuleCaller: function (eventName) {
    return function () {
      for (var prop in cwt) {
        var module = cwt[prop];
        if (module[eventName]) {
          module[eventName].apply(module,arguments);
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
   *
   * @param {Function} fn
   * @return {Function}
   */
  lazy: function (fn) {
    var value = undefined;
    return function () {
      if (value === void 0) {
        value = fn();
      }

      return value;
    }
  }
};

/* Registers generic error listener. */
window.onerror = function (e, file, line, column, errorObj) {
  if (cwt.Error) {
   // cwt.Error("Critical Game Fault","ERR_UNKNOWN");
  }
  console.error(e,(arguments.length > 0)? file+" line:"+line : null);
};