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
    var data = cwt.matrix(MAX_MAP_WIDTH, MAX_MAP_HEIGHT);
    for (var x = 0, xe = cwt.Map.map_width; x < xe; x++) {
      for (var y = 0, ye = cwt.Map.map_height; y < ye; y++) {
        data[x][y] = new cwt.Tile();
      }
    }

    return data;
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

  // --------------------------

  save: function (dom) {
    dom.mpw = model.map_width;
    dom.mph = model.map_height;
    dom.map = [];

    // generates ID map
    var mostIdsMap = {};
    var mostIdsMapCurIndex = 0;
    for (var x = 0, xe = model.map_width; x < xe; x++) {

      dom.map[x] = [];
      for (var y = 0, ye = model.map_height; y < ye; y++) {

        var type = dom.map[x][y].ID;

        if (!mostIdsMap.hasOwnProperty(type)) {
          mostIdsMap[type] = mostIdsMapCurIndex;
          mostIdsMapCurIndex++;
        }

        dom.map[x][y] = mostIdsMap[type];
      }
    }

    // store map
    dom.typeMap = [];
    var typeKeys = Object.keys(mostIdsMap);
    for (var i = 0, e = typeKeys.length; i < e; i++) {
      dom.typeMap[mostIdsMap[typeKeys[i]]] = typeKeys[i];
    }
  },

  prepare: function (dom) {
    model.map_width = dom.mpw;
    model.map_height = dom.mph;

    for (var x = 0, xe = model.map_width; x < xe; x++) {
      for (var y = 0, ye = model.map_height; y < ye; y++) {
        model.unit_posData[x][y] = null;
        model.property_posMap[x][y] = null;
        model.map_data[x][y] = model.data_tileSheets[dom.typeMap[dom.map[x][y]]];
      }
    }
  }

};