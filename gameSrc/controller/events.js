/**
 *
 * @namespace
 */
cwt.ClientEvents = {

  /**
   *
   * @param {number} sx
   * @param {number} sy
   * @param {number} tx
   * @param {number} ty
   * @param {cwt.Array} way
   * @param {boolean} trapped
   */
  unitMoves: function (sx, sy, tx, ty, way, trapped) {

  },

  unitWaits: function () {

  },

  goldChange: function (player, money, x, y) {
    // Play a money down animation
  },

  unitCreated: function (x, y, unit) {

  },

  unitDestroyed: function (x, y, unit) {

  },

  unitCaptures: function (property, capturer) {

  },

  propertyCaptured: function (property, capturer) {

  },

  propertyTypeChanged: function (property, typeOld, typeNew) {

  }

};
