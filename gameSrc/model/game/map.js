/**
 * @class
 */
cwt.Map = my.Class({

  STATIC: {

    /**
     * Returns the distance of two positions.
     */
    getDistance: function (sx, sy, tx, ty) {
      assert(this.isValidPosition(sx, sy));
      assert(this.isValidPosition(tx, ty));

      return Math.abs(sx - tx) + Math.abs(sy - ty);
    }

  },

  constructor: function () {
    this.width = 0;
    this.height = 0;

    // create tile elements
    this.data = cwt.matrix(MAX_MAP_WIDTH, MAX_MAP_HEIGHT);
    for (var x = 0, xe = model.map_width; x < xe; x++) {
      for (var y = 0, ye = model.map_height; y < ye; y++) {
        this.data[x][y] = null;
      }
    }
  },

  /**
   * Returns true if the given position (x,y) is valid on the current
   * active map, else false.
   */
  isValidPosition: function (x, y) {
    return ( x >= 0 && y >= 0 && x < this.width && y < this.height );
  },

  /**
   *
   * @param x
   * @param y
   * @return {*}
   */
  getUnit: function (x, y) {
    var Unit = cwt.Unit;
    for (var i = 0, e = MAX_UNITS_PER_PLAYER*MAX_PLAYER; i < e; i++) {
      var unit = Unit.getInstance(i, true);
      if (unit && unit.x === x && unit.y === y) return unit;
    }

    return null;
  },

  /**
   *
   * @param x
   * @param y
   * @return {*}
   */
  getProperty: function (x, y) {
    var Property = cwt.Property;
    for (var i = 0, e = MAX_PROPERTIES; i < e; i++) {
      var prop = Property.getInstance(i, true);
      if (prop && prop.x === x && prop.y === y) return prop;
    }

    return null;
  },

  /**
   *
   * @return {Boolean}
   */
  isOccupied: function (x, y) {
    return (this.getUnit(x, y) !== null);
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
    if (hY >= this.height) hY = this.height - 1;
    for (; lY <= hY; lY++) {

      var disY = Math.abs(lY - y);
      lX = x - range + disY;
      hX = x + range - disY;
      if (lX < 0) lX = 0;
      if (hX >= this.width) hX = this.width - 1;
      for (; lX <= hX; lX++) {

        // invoke the callback on all tiles in range
        // if a callback returns `false` then the process will be stopped
        if (cb(lX, lY, arg, Math.abs(lX - x) + disY) === false) return;

      }
    }
  }

});