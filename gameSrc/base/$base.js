/**
 * Base package of the game.
 *
 * @namespace
 */
var cwt = {

  MOD_PATH: "localhost:8000/",

  /**
   * Represents a numeric code which means no data.
   */
  INACTIVE: -1,

  /**
   * Determines the debug mode.
   */
  DEBUG: false,

  /**
   * @constant
   */
  DEV_NO_CACHE: true,

  emptyFunction: function () {
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
      throw new Error(msgA);
    }
  }
};