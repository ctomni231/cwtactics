/**
 * @namespace
 */
cwt.Options = {

  /**
   * @constant
   */
  PARAM_WIPEOUT: "cwt_resetData",

  /**
   * @constant
   */
  PARAM_FORCE_TOUCH: "cwt_forceTouch",

  /**
   * @constant
   */
  PARAM_ANIMATED_TILES: "cwt_animatedTiles",

  /**
   * @type {boolean}
   */
  forceTouch: false,

  /**
   * @type {boolean}
   */
  animatedTiles: true,

  /**
   *
   * @param cb
   */
  saveOptions: function (cb) {
    cwt.Storage.generalStorage.set(cwt.Options.PARAM_ANIMATED_TILES, cwt.Options.animatedTiles, function () {
      cwt.Storage.generalStorage.set(cwt.Options.PARAM_FORCE_TOUCH, cwt.Options.forceTouch, function () {
        if (cb) {
          cb();
        }
      });
    });
  },

  /**
   *
   * @param cb
   */
  loadOptions: function (cb) {
    cwt.Storage.generalStorage.get(cwt.Options.PARAM_ANIMATED_TILES, function (obj) {
      if (obj) {
        cwt.Options.animatedTiles = obj.value;
      }

      cwt.Storage.generalStorage.get(cwt.Options.PARAM_FORCE_TOUCH, function (obj) {
        if (obj) {
          cwt.Options.forceTouch = obj.value;
        }

        if (cb) {
          cb();
        }
      });
    });
  }
};