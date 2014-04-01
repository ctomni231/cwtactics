/**
 *
 * @class
 * @template T
 */
cwt.CircularBuffer = my.Class({

  /**
   * @param {number} size
   */
  constructor: function (size) {
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
   * Returns an object from the buffer
   *
   * @return {T} oldest object in the buffer
   */
  pop: function () {
    if (this.size === 0) {
      throw Error("buffer is empty");
    }

    var obj = this.data[this.index];

    this.size--;
    this.index++;
    if (this.index === this.maxSize) {
      this.index = 0;
    }

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

    this.data[(this.index+this.size-1)%this.maxSize] = el;
    this.size++;
  },

  /**
   *
   */
  clear: function () {
    this.index = 0;
    this.size = 0;
  }
});