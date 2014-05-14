/**
 * Object that holds information about objects at a given position (x,y).
 *
 * @class
 */
cwt.Position = my.Class(/** @lends cwt.Position.prototype */ {

  constructor: function () {
    this.clean();
  },

  /**
   * Cleans all data of the object.
   */
  clean: function () {
    this.x = -1;
    this.y = -1;
    this.tile = null;
    this.unit = null;
    this.property = null;
    this.unitId = -1;
    this.propertyId = -1;
  },

  /**
   * Grabs the data from another position object.
   */
  grab: function (otherPos) {
    cwt.assert(otherPos instanceof cwt.Position);

    this.x = otherPos.x;
    this.y = otherPos.y;
    this.tile = otherPos.tile;
    this.unit = otherPos.unit;
    this.unitId = otherPos.unitId;
    this.property = otherPos.property;
    this.propertyId = otherPos.propertyId;
  },

  /**
   * Sets a position.
   */
  set: function (x, y) {
    this.clean();

    this.x = x;
    this.y = y;
    this.tile = cwt.Map.data[x][y];

    if (this.tile.turnOwnerVisible && this.tile.unit) {
      this.unit = null;
      this.unitId = cwt.Unit.getId(this.tile.unit);
    }

    if (this.tile.property) {
      this.property = this.tile.property;
      this.propertyId = cwt.Property.getId(this.tile.property);
    }
  }
});