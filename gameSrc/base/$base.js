/**
 * Base package of the game.
 *
 * @namespace
 */
window.cwt = {

  GAME_FONT: "Gamefont",

  MOD_PATH: "http://localhost:8000/",
  // MOD_PATH: "http://192.168.1.30:8000/",

  /**
   * Tile size base.
   *
   * @constant
   */
  TILE_BASE: 16,

  /**
   * Number of tiles in a row in the screen.
   *
   * @constant
   */
  MAX_TILES_W: 20,

  /**
   * Number of tiles in a column in the screen.
   *
   * @constant
   */
  MAX_TILES_H: 15,

  /**
   * Represents a numeric code which means no data.
   *
   * @constant
   */
  INACTIVE: -1,

  /** @constant */
  DESELECT_ID: -2,

  /** @constant */
  NOT_AVAILABLE: -2,

  /**
   * Determines the debug mode.
   */
  DEBUG: true,

  /** @constant */
  SCREEN_WIDTH: 32,
  //SCREEN_WIDTH: parseInt(window.innerWidth/16,10),

  /** @constant */
  SCREEN_HEIGHT: 24,
  //SCREEN_HEIGHT: parseInt(window.innerHeight/16,10),

  /** @constant */
  MAX_MAP_WIDTH: 60,

  /** @constant */
  MAX_MAP_HEIGHT: 40,

  /** @constant */
  MAX_MOVE_LENGTH: 15,

  /** @constant */
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