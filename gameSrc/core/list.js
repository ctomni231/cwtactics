cwt.List = my.Class({

  constructor: function (len, defaultValue) {
    if (defaultValue === undefined) {
      defaultValue = null;
    }

    this.data = [];
    this.defValue = defaultValue;
    this.length = len;

    this.resetValues();
  },

  /**
   *
   */
  resetValues: function () {
    var defValue = this.defValue;
    var len = this.length;
    var isFN = typeof defValue === 'function';

    // SIMPLE ARRAY OBJECT
    for (var i = 0, e = len; i < e; i++) {
      if (isFN) this.data[i] = defValue(i, this.data[i]);
      else       this.data[i] = defValue;
    }
  },

  /**
   *
   * @param {cwt.List} list
   */
  clone: function (list) {
    var lenA = this.length;
    var lenB = list.length;
    if (lenB !== lenA) throw Error("source and target list have different lengths");

    for (var i = 0, e = lenA; i < e; i++) {
      list.data[i] = this.data[i];
    }
  },

  /**
   *
   * @param list
   */
  grab: function (list) {
    var lenA = this.length;
    var lenB = list.length;
    if (lenB !== lenA) throw Error("source and target list have different lengths");

    for (var i = 0, e = lenA; i < e; i++) {
      this.data[i] = list.data[i];
    }
  }
});