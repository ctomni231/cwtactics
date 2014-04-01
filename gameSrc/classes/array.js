cwt.Array = my.Class({

  constructor: function (maxSize,defElement) {
    this.maxSize_ = maxSize;
    this.defEl_ = defElement;
    this.index = 0;
    this.data  = [];

    this.clear();
  },

  clear: function (startIndex) {
    if (startIndex === void 0) {
      startIndex = 0;
    }

    for (var i = startIndex, e = this.maxSize_; i<e; i++) {
      this.data[i] = this.defEl_;
    }
  },

  push: function (el) {
    if (this.DEBUG) cwt.assert(this.index < this.maxSize_);

    this.data[this.index] = el;
    this.index++;
  },

  pop: function () {
    if (this.index === 0) return null;

    var el = this.data[this.index-1];

    // clear slot
    this.data[this.index-1] = this.defEl_;
    this.index--;

    return el;
  },

  getSize: function () {
    return this.index;
  },

  getLastIndex: function () {
    return this.index-1;
  },

  getLastElement: function () {
    if (this.index === 0) return null;
    return this.data[this.index-1];
  }
});