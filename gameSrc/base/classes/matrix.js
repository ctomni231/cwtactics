//
//
// @class
//
cwt.Matrix = my.Class({

  constructor: function (w, h, defaultValue) {
    if (defaultValue === undefined) {
      defaultValue = null;
    }

    this.data = [];
    this.defValue = defaultValue;
    this.width = w;
    this.height = h;

    // CREATE SUB ARRAYS
    for (var i = 0; i < w; i++) {
      this.data[i] = [];
    }

    this.resetValues();
  },

  //
//
//
  resetValues: function () {
    var defValue = this.defValue;
    var w = this.width;
    var h = this.height;
    var isFN = typeof defValue === 'function';

    // COMPLEX ARRAY (MATRIX) OBJECT
    for (var i = 0, e = w; i < e; i++) {
      for (var j = 0, ej = h; j < ej; j++) {
        if (isFN) this.data[i][j] = defValue(i, j, this.data[i][j]);
        else       this.data[i][j] = defValue;
      }
    }
  },

  //
//
// @param {cwt.Matrix} matrix
//
  clone: function (matrix) {
    var w = this.width;
    var h = this.height;
    if (matrix.data.length !== this.data.length) throw Error();

    // COMPLEX ARRAY (MATRIX) OBJECT
    for (var i = 0, e = w; i < e; i++) {
      for (var j = 0, ej = h; j < ej; j++) {
        matrix.data[i][j] = this.data[i][j];
      }
    }
  }
});