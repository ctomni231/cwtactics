/**
 * @class
 * @extends cwt.Multiton
 */
cwt.Property = my.Class(cwt.Multiton, {

  STATIC: {

    MULTITON_INSTANCES: MAX_PROPERTIES,

    CAPTURE_POINTS: 20,

    CAPTURE_STEP: 10,

    /**
     *
     */
    countProperties: function (player) {
      var n = 0;

      for (var i = 0, e = MAX_PROPERTIES; i < e; i++) {
        var prop = cwt.Property.getInstance(i, true);
        if (prop && prop.owner === player) n++;
      }

      return n;
    }

  },

  constructor: function () {
    this.x = 0;
    this.y = 0;
    this.points = 20;

    /**
     * @type {cwt.Player}
     */
    this.owner = null;

    this.type = null;
  },

  /**
   * Returns true, when the given property is neutral, else false.
   */
  isNeutral: function () {
    return this.owner === null;
  },

  /**
   * Returns true, when a unit can capture a property,
   * else false.
   */
  canBeCapturedBy: function (unit) {
    return this.type.capturePoints > 0 && unit.type.captures > 0;
  },

  /**
   *
   */
  captureProperty: function (unit) {
    if (DEBUG) assert(unit);

    this.points -= cwt.Property.CAPTURE_STEP;
    cwt.ClientEvents.unitCaptures(this,unit);

    if (this.points <= 0) {
      this.owner = unit.owner;
      this.points = cwt.Property.CAPTURE_POINTS;
      cwt.ClientEvents.propertyCaptured(this,unit);
    }
  },

  /**
   * Gives funds.
   */
  raiseFunds: function () {
    if (typeof this.type.funds !== "number") return;
    this.owner.gold += this.type.funds;

    cwt.ClientEvents.goldChange(this.owner, this.type.funds);
  }

});