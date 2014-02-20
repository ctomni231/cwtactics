/**
 * @class
 * @extends cwt.Multiton
 */
cwt.Property = my.Class(null,cwt.Multiton, {

  STATIC: {

    /**
     * Number of maximum properties.
     */
    MULTITON_INSTANCES: 200,

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
  }

});