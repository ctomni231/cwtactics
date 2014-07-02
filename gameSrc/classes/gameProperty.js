/**
 * @class
 * @extends cwt.IndexMultiton
 */
cwt.Property = my.Class(/** @lends cwt.Property.prototype */ {

  STATIC: /** @lends cwt.Property */ {

    /**
     * Number of maximum properties.
     */
    MULTITON_INSTANCES: 200,

    CAPTURE_POINTS: 20,

    CAPTURE_STEP: 10,

    /**
     *
     * @param {cwt.Player} player
     * @return {number}
     */
    countProperties: function (player) {
      var n = 0;

      for (var i = 0, e = this.MULTITON_INSTANCES; i < e; i++) {
        var prop = cwt.Property.getInstance(i, true);
        if (prop && prop.owner === player) n++;
      }

      return n;
    },

    releasePlayerProperties: function (player) {
      for (var i = 0, e = this.MULTITON_INSTANCES; i < e; i++) {
        var prop = cwt.Property.getInstance(i, true);
        if (prop && prop.owner === player) {
          // TODO

          // change type when the property is a
          // changing type property
          // var changeType = prop.type.changeAfterCaptured;
          // if (changeType) model.events.property_changeType(i, changeType);
        }
      }
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

// use index based multiton trait
my.extendClass(cwt.Property,{STATIC:cwt.IndexMultiton});