/**
 *
 * @class
 * @template T
 */
cwt.CircularBuffer = my.Class({

  /**
   * @param {number?} size (default 32)
   */
  constructor: function (size) {
    if (arguments.length === 0) {
      size = 32;
    } else if (size <= 0) {
      throw Error("size cannot be 0 or lower");
    }

    this.index = 0;
    this.size = 0;
    this.data = [];
    this.maxSize = size;
  },

  /**
   * @return {boolean} true when no entries are in the buffer, else false
   */
  isEmpty: function () {
    return this.size === 0;
  },

  /**
   *
   * @param index
   * @return {*}
   */
  get: function (index) {
    if (index < 0 || index >= this.size) {
      throw Error("illegal index");
    }

    return this.data[(this.index+index)%this.maxSize];
  },

  /**
   * Returns the oldest object from the buffer
   *
   * @return {T} oldest object in the buffer
   */
  popFirst: function () {
    if (this.size === 0) {
      throw Error("buffer is empty");
    }

    var obj = this.data[this.index];

    // remove entry to prevent memory leaks
    this.data[this.index] = null;

    this.size--;
    this.index++;
    if (this.index === this.maxSize) {
      this.index = 0;
    }

    return obj;
  },

  /**
   * Returns the youngest object from the buffer
   *
   * @return {T} youngest object in the buffer
   */
  popLast: function () {
    if (this.size === 0) {
      throw Error("buffer is empty");
    }

    var index = (this.index + this.size - 1) % this.maxSize;
    var obj = this.data[index];

    // remove entry to prevent memory leaks
    this.data[index] = null;
    this.size--;

    return obj;
  },

  /**
   * Pushes an object into the buffer.
   *
   * @param {T} el object that will be pushed into the buffer
   */
  push: function (el) {
    if (this.size === this.maxSize) {
      throw Error("buffer is full");
    }

    this.data[(this.index + this.size) % this.maxSize] = el;
    this.size++;
  },

  /**
   *
   */
  clear: function () {
    this.index = 0;
    this.size = 0;

    // remove references from list to prevent memory leaks
    for (var i= 0, e=this.data.length; i<e; i++) {
      this.data[i] = null;
    }
  }
});