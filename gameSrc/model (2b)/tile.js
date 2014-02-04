/**
 *
 * @class
 */
cwt.Tile = my.Class({

  constructor: function () {
    this.unit = null;
    this.property = null;
    this.type = null;
  },

  /**
   *
   * @param unit
   */
  setUnit: function ( unit ) {
    if( DEBUG ) assert( unit instanceof cwt.Unit );

    this.unit = unit;
  },

  /**
   *
   * @param property
   */
  setProperty: function ( property ) {
    if( DEBUG ) assert( property instanceof cwt.Property );

    this.property = property;
  },

  /**
   *
   * @return {Boolean}
   */
  isOccupied: function () {
    return this.unit !== null;
  }

});