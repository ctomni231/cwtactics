/**
 * @namespace
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
    var matrix = new cwt.Matrix(cwt.MAX_MAP_WIDTH, cwt.MAX_MAP_HEIGHT);
    for (var x = 0, xe = cwt.MAX_MAP_WIDTH; x < xe; x++) {
      for (var y = 0, ye = cwt.MAX_MAP_HEIGHT; y < ye; y++) {
        matrix.data[x][y] = new cwt.Tile();
      }
    }

    return matrix.data;
  })(),

  /**
   * Returns the distance of two positions.
   */
  getDistance: function (sx, sy, tx, ty) {
    if (this.DEBUG) cwt.assert(this.isValidPosition(sx, sy));
    if (this.DEBUG) cwt.assert(this.isValidPosition(tx, ty));

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
   *
   * @param property
   * @param cb
   * @param cbThis
   * @param arg
   */
  searchProperty: function (property, cb, cbThis, arg) {
    for (var x = 0, xe = this.width; x < xe; x++) {
      for (var y = 0, ye = this.height; y < ye; y++) {
        if (this.data[x][y].property === property) {
          cb.call(cbThis,x,y,property,arg);
        }
      }
    }
  },

  /**
   *
   * @param unit
   * @param cb
   * @param cbThis
   * @param {Object=} arg
   */
  searchUnit: function (unit, cb, cbThis, arg) {
    for (var x = 0, xe = this.width; x < xe; x++) {
      for (var y = 0, ye = this.height; y < ye; y++) {
        if (this.data[x][y].unit === unit) {
          return cb.call(cbThis,x,y,unit,arg);
        }
      }
    }
  },

  /**
   * Invokes a callback on all tiles in a given range at a position (x,y).
   */
  doInRange: function (x, y, range, cb, arg) {
    if (this.DEBUG) cwt.assert(this.isValidPosition(x, y));
    if (this.DEBUG) cwt.assert(typeof cb === "function");
    if (this.DEBUG) cwt.assert(range >= 0);

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
        if (cb(lX, lY, this.data[lX][lY], arg, Math.abs(lX - x) + disY) === false) return;

      }
    }
  },

  $onSaveGame: function (data) {
    data.mpw = this.width;
    data.mph = this.height;
    data.map = [];

    // generates ID map
    var mostIdsMap = {};
    var mostIdsMapCurIndex = 0;
    for (var x = 0, xe = this.width; x < xe; x++) {

      data.map[x] = [];
      for (var y = 0, ye = this.height; y < ye; y++) {
        var type = this.data[x][y].type.ID;

        // create number for type
        if (!mostIdsMap.hasOwnProperty(type)) {
          mostIdsMap[type] = mostIdsMapCurIndex;
          mostIdsMapCurIndex++;
        }

        data.map[x][y] = mostIdsMap[type];
      }
    }

    // generate type map
    data.typeMap = [];
    var typeKeys = Object.keys(mostIdsMap);
    for (var i = 0, e = typeKeys.length; i < e; i++) {
      data.typeMap[mostIdsMap[typeKeys[i]]] = typeKeys[i];
    }
  },

  $onLoadGame: function (data,isSave) {
    this.width = data.mpw;
    this.height = data.mph;

    for (var x = 0, xe = this.width; x < xe; x++) {
      for (var y = 0, ye = this.height; y < ye; y++) {
        this.data[x][y].type = cwt.TileSheet.sheets[data.typeMap[data.map[x][y]]];
      }
    }
  }

};