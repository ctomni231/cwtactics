/**
 * @class
 */
cwt.Map = my.Class({

  constructor: function () {
    this.data = null; // cwt.List.generateMatrix(MAX_WIDTH,MAX_HEIGHT);
    this.properties = null; // list properties
    this.width = 0;
    this.height = 0;
  },

  /**
   * Returns the distance of two positions.
   */
  getDistance: function (sx, sy, tx, ty) {
    assert(this.isValidPosition(sx, sy));
    assert(this.isValidPosition(tx, ty));

    return Math.abs(sx - tx) + Math.abs(sy - ty);
  },

  /**
   * Returns true if the tile at position x,y is a property, else false.
   */
  isProperty: function (x, y) {
    assert(this.map_isValidPosition(x, y));

    return model.property_getByPos(x, y) !== null;
  },

  /**
   * Returns true if the given position (x,y) is valid on the current
   * active map, else false.
   */
  isValidPosition: function (x, y) {
    return ( x >= 0 && y >= 0 && x < this.width && y < this.height );
  },

  /**
   * Invokes a callback on all tiles in a given range at a position (x,y).
   */
  doInRange: function (x, y, range, cb, arg) {
    assert(this.map_isValidPosition(x, y));
    assert(typeof cb === "function");
    assert(range >= 0);

    var lX;
    var hX;
    var lY = y - range;
    var hY = y + range;
    if (lY < 0) lY = 0;
    if (hY >= model.map_height) hY = model.map_height - 1;
    for (; lY <= hY; lY++) {

      var disY = Math.abs(lY - y);
      lX = x - range + disY;
      hX = x + range - disY;
      if (lX < 0) lX = 0;
      if (hX >= model.map_width) hX = model.map_width - 1;
      for (; lX <= hX; lX++) {

        // invoke the callback on all tiles in range
        // if a callback returns `false` then the process will be stopped
        if (cb(lX, lY, arg, Math.abs(lX - x) + disY) === false) return;

      }
    }
  }

});