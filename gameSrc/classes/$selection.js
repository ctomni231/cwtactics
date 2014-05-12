/**
 *
 * @class
 */
cwt.SelectionMap = my.Class({

  constructor: function (size) {
    this.centerX = 0;
    this.centerY = 0;

    /**
     * @type {cwt.Matrix}
     */
    this.data = new cwt.Matrix(size, size, cwt.INACTIVE);
  },

  /**
   *
   * @param x
   * @param y
   * @param defValue
   */
  setCenter: function (x, y, defValue) {
    var e = this.data.length;
    var cx = x;
    var cy = y;

    // reset aw2
    for (x = 0; x < e; x++) {
      for (y = 0; y < e; y++) {
        this.data[x][y] = defValue;
      }
    }

    // right bounds are not important
    this.centerX = Math.max(0, cx - (e - 1));
    this.centerY = Math.max(0, cy - (e - 1));
  },

  /**
   *
   * @param x
   * @param y
   * @return {*}
   */
  getValueAt: function (x, y) {
    var data = this.data;
    var cy = this.centerX;
    var cx = this.centerY;
    var maxLen = data.length;

    x = x - cx;
    y = y - cy;
    if (x < 0 || y < 0 || x >= maxLen || y >= maxLen) return -1;
    else return data[x][y];
  },

  /**
   *
   * @param x
   * @param y
   * @param value
   */
  setValueAt: function (x, y, value) {
    var data = this.data;
    var cy = this.centerX;
    var cx = this.centerY;
    var maxLen = data.length;

    x = x - cx;
    y = y - cy;
    if (x < 0 || y < 0 || x >= maxLen || y >= maxLen) {
      throw Error("Out of Bounds");
    }
    else data[x][y] = value;
  },

  hasActiveNeighbour: function (x, y) {
    var data = this.data;
    var cy = this.centerX;
    var cx = this.centerY;
    var maxLen = data.length;

    x = x - cx;
    y = y - cy;

    if (x < 0 || y < 0 || x >= maxLen || y >= maxLen) {
      throw Error("Out of Bounds");
    }

    if (x > 0 && data[x - 1][y] > 0) return true;
    if (x < maxLen - 1 && data[x + 1][y] > 0) return true;
    if (y > 0 && data[x][y - 1] > 0) return true;
    if (y < maxLen - 1 && data[x][y + 1] > 0) return true;

    return false;
  },

  /**
   *
   * @param otherSelection
   */
  grab: function (otherSelection) {
    if (this.data.length !== otherSelection.data.length) throw Error("illegal grab selection");
    this.centerX = otherSelection.centerX;
    this.centerY = otherSelection.centerY;

    var e = this.data.length;
    for (var x = 0; x < e; x++) {
      for (var y = 0; y < e; y++) {
        this.data[x][y] = otherSelection.data[x][y];
      }
    }
  },

  /**
   *
   * @param x
   * @param y
   * @param minValue
   * @param walkLeft
   * @param cb
   * @param arg
   */
  nextValidPosition: function (x, y, minValue, walkLeft, cb, arg) {
    var data = this.data;
    var cy = this.centerX;
    var cx = this.centerY;
    var maxLen = data.length;

    x = x - cx;
    y = y - cy;

    // OUT OF BOUNDS ?
    if (x < 0 || y < 0 || x >= maxLen || y >= maxLen) {

      // START BOTTOM RIGHT
      if (walkLeft) {
        x = maxLen - 1;
        y = maxLen - 1;
      }
      // START TOP LEFT
      else {
        x = 0;
        y = 0;
      }
    }

    // WALK TO THE NEXT TARGET
    var mod = (walkLeft) ? -1 : +1;
    y += mod;
    for (; (walkLeft) ? x >= 0 : x < maxLen; x += mod) {
      for (; (walkLeft) ? y >= 0 : y < maxLen; y += mod) {

        // VALID POSITION
        if (data[x][y] >= minValue) {
          cb(x, y, arg);
          return;
        }
      }
      y = (walkLeft) ? maxLen - 1 : 0;
    }
  },

  /**
   *
   * @param cb
   * @param arg
   * @param minValue
   * @return {boolean}
   */
  nextRandomPosition: function (cb, arg, minValue) {
    if (minValue === void 0) minValue = 0;

    var e = this.data.length;
    var n = parseInt(Math.random() * e, 10);
    var x, y;
    for (x = 0; x < e; x++) {
      for (y = 0; y < e; y++) {
        if (this.data[x][y] >= minValue) {
          n--;
          if (n < 0) {
            cb(x, y, arg);
            return true;
          }
        }
      }
    }

    return false;
  }
});