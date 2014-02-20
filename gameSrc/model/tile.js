/**
 *
 * @class
 */
cwt.Tile = my.Class( /* @lends cwt.Tile */ {

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

  /**
   *
   * @return {boolean}
   */
  isOccupied:  function () {
    return this.unit !== null;
  },

  /**
   *
   * @return {boolean}
   */
  isVisible: function () {
    return this.visionTurnOwner > 0;
  }

});