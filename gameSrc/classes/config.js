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