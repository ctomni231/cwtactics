/**
 * @class
 */
cwt.Map = {

  /**
   * Current width of the map.
   *
   * @type {Number}
   */
  width: 0,

  /**
   * Current height of the map.
   *
   * @type {Number}
   */
  height: 0,

  /**
   * All tiles of the map.
   *
   * @type {Array.<Array.<cwt.Tile>>}
   */
  data: (function () {
    var data = cwt.matrix(MAX_MAP_WIDTH, MAX_MAP_HEIGHT);
    for (var x = 0, xe = cwt.Map.map_width; x < xe; x++) {
      for (var y = 0, ye = cwt.Map.map_height; y < ye; y++) {
        data[x][y] = new cwt.Tile();
      }}

    return data;
  })(),

  /**
   * Returns the distance of two positions.
   */
  getDistance: function (sx, sy, tx, ty) {
    if (DEBUG) assert(this.isValidPosition(sx, sy));
    if (DEBUG) assert(this.isValidPosition(tx, ty));

    return Math.abs(sx - tx) + Math.abs(sy - ty);
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
    if (DEBUG) assert(this.isValidPosition(x, y));
    if (DEBUG) assert(typeof cb === "function");
    if (DEBUG) assert(range >= 0);

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

};