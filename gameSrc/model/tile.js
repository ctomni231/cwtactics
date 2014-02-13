/**
 *
 * @class
 */
cwt.Tile = my.Class({

  constructor: function () {

    /**
     * @type {cwt.Unit}
     */
    this.unit = null;

    /**
     * @type {cwt.Property}
     */
    this.property = null;

    /**
     * @type {number}
     */
    this.visionTurnOwner = 0;

    /**
     * @type {number}
     */
    this.visionClient = 0;
  },

  isOccupied:  function () {
    return this.unit !== null;
  }

});